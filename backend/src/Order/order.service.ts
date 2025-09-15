import { Injectable, NotFoundException, Inject, forwardRef, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderDto } from './order.dto';
import { OrderItemService } from '../OrderItem/orderItem.service';

const Pusher = require('pusher');
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_KEY as string,
  secret: process.env.PUSHER_SECRET as string,
  cluster: process.env.PUSHER_CLUSTER as string,
  useTLS: true,
});

@Injectable()
export class OrderService {
  private pusher: any;
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(forwardRef(() => OrderItemService))
    public readonly orderItemService: OrderItemService,
    private readonly configService: ConfigService,
  ) {
    const Pusher = require('pusher');
    this.pusher = new Pusher({
      appId: this.configService.get<string>('PUSHER_APP_ID'),
      key: this.configService.get<string>('PUSHER_KEY'),
      secret: this.configService.get<string>('PUSHER_SECRET'),
      cluster: this.configService.get<string>('PUSHER_CLUSTER'),
      useTLS: true,
    });
  }

  async findAll(customerId?: number): Promise<OrderEntity[]> {
    return await this.orderRepository.find({ where: { customerId }, relations: ['orderItems', 'customer'] });
  }

  async findOne(id: number, customerId?: number): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({ where: { id, customerId }, relations: ['orderItems', 'customer'] });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async create(dto: OrderDto): Promise<OrderEntity> {
    try {
  // ...existing code...
      let { customerId, status, orderItems } = dto;
      // Check stock for all items before creating order
      if (orderItems && Array.isArray(orderItems) && orderItems.length > 0) {
        for (const item of orderItems) {
          await this.orderItemService.checkProductStock(item.productId, item.quantity);
        }
      }
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
      // Trigger Pusher event if order is pending
      if (savedOrder.status === 'pending') {
        await this.pusher.trigger('orders', 'pending-order', { orderId: savedOrder.id });
      }
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
