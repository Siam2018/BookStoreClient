import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './order.entity';
import { OrderDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  async findAll(): Promise<OrderEntity[]> {
    try {
      return await this.orderRepository.find({ relations: ['orderItems', 'customer'] });
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get all orders',
        error.status || 500
      );
    }
  }

  async findOne(id: number): Promise<OrderEntity> {
    try {
      const order = await this.orderRepository.findOne({ where: { id }, relations: ['orderItems', 'customer'] });
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
      // Only assign fields compatible with OrderEntity
      const { customerId, status } = dto;
      const order = this.orderRepository.create({ customerId, status, total: 0 });
      // Save first to get an order ID
      const savedOrder = await this.orderRepository.save(order);
      // Calculate total (should be 0 at creation)
      savedOrder.total = await this.calculateOrderTotal(savedOrder.id);
      return this.orderRepository.save(savedOrder);
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to create order',
        error.status || 500
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
