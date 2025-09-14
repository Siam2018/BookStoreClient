import { Injectable, NotFoundException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderDto } from './order.dto';
import { OrderItemService } from '../OrderItem/orderItem.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(forwardRef(() => OrderItemService))
    public readonly orderItemService: OrderItemService,
  ) {}

  async findAll(customerId?: number): Promise<OrderEntity[]> {
    try {
      if (!customerId) throw new UnauthorizedException('Customer ID required');
      return await this.orderRepository.find({ where: { customerId }, relations: ['orderItems', 'customer'] });
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get all orders',
        error.status || 500
      );
    }
  }

  async findOne(id: number, customerId?: number): Promise<OrderEntity> {
    try {
      if (!customerId) throw new UnauthorizedException('Customer ID required');
      const order = await this.orderRepository.findOne({ where: { id, customerId }, relations: ['orderItems', 'customer'] });
      if (!order) throw new NotFoundException('Order not found');
      return order;
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get order',
        error.status || 500
      );
    }
  }


  async create(dto: OrderDto): Promise<OrderEntity> {
    try {
      const { customerId, status, orderItems } = dto;
      // Check stock for all items before creating order
      if (orderItems && Array.isArray(orderItems) && orderItems.length > 0) {
        for (const item of orderItems) {
          await this.orderItemService.checkProductStock(item.productId, item.quantity);
        }
      }
      // Create order first
      const order = this.orderRepository.create({ customerId, status, total: 0 });
      const savedOrder = await this.orderRepository.save(order);
      // If orderItems are present, create them and associate with order
      if (orderItems && Array.isArray(orderItems) && orderItems.length > 0) {
        const itemsWithOrderId = orderItems.map(item => ({ ...item, orderId: savedOrder.id }));
        if (this['orderItemService']) {
          await this['orderItemService'].createMany(itemsWithOrderId);
        } else {
          throw new Error('OrderItemService not injected');
        }
      }
      // Recalculate total
      savedOrder.total = await this.calculateOrderTotal(savedOrder.id);
      return this.orderRepository.save(savedOrder);
    } catch (error) {
      // Return a clear error message for out-of-stock or other issues
      throw new (error.constructor || require('@nestjs/common').BadRequestException)(
        error.message || 'Failed to create order',
        error.status || 400
      );
    }
  }

  async update(id: number, dto: Partial<OrderDto>): Promise<OrderEntity> {
    try {
      const order = await this.findOne(id);
      const { customerId, status } = dto;
      if (customerId !== undefined) order.customerId = customerId;
      if (status !== undefined) order.status = status;
      // Recalculate total after update
      order.total = await this.calculateOrderTotal(order.id);
      return this.orderRepository.save(order);
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to update order',
        error.status || 500
      );
    }
  }

  async calculateOrderTotal(orderId: number): Promise<number> {
    try {
      // Get all order items for this order
      const order = await this.orderRepository.findOne({ where: { id: orderId }, relations: ['orderItems'] });
      if (!order || !order.orderItems) return 0;
      return order.orderItems.reduce((sum, item) => sum + Number(item.subtotal), 0);
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to calculate order total',
        error.status || 500
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const order = await this.findOne(id);
      await this.orderRepository.remove(order);
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to delete order',
        error.status || 500
      );
    }
  }
}
