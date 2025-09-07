
import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../Products/product.entity';

import { OrderItemDto } from './orderItem.dto';
import { OrderItem } from './orderItem.entity';

import { OrderService } from '../Order/order.service';


@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly orderService: OrderService,
  ) {}

  async findAll(): Promise<OrderItem[]> {
    try {
      return await this.orderItemRepository.find();
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get all order items',
        error.status || 500
      );
    }
  }

  async findOne(id: number): Promise<OrderItem> {
    try {
      const item = await this.orderItemRepository.findOne({ where: { id } });
      if (!item) {
        throw new NotFoundException('Order item not found');
      }
      return item;
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get order item',
        error.status || 500
      );
    }
  }

  async create(dto: OrderItemDto): Promise<OrderItem> {
    try {
      const item = await this.createOrderItem(dto);
      if (item.orderId) {
        await this.orderService.update(item.orderId, {});
      }
      return item;
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to create order item',
        error.status || 500
      );
    }
  }

  async createMany(dtos: OrderItemDto[]): Promise<OrderItem[]> {
    try {
      const items = await this.createOrderItemsBatch(dtos);
      if (items.length && items[0].orderId) {
        await this.orderService.update(items[0].orderId, {});
      }
      return items;
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to create order items',
        error.status || 500
      );
    }
  }

  async update(id: number, dto: Partial<OrderItemDto>): Promise<OrderItem> {
    try {
      const item = await this.orderItemRepository.findOne({ where: { id } });
      if (!item) {
        throw new NotFoundException('Order item not found');
      }
      Object.assign(item, dto);
      const saved = await this.orderItemRepository.save(item);
      if (saved.orderId) {
        await this.orderService.update(saved.orderId, {});
      }
      return saved;
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to update order item',
        error.status || 500
      );
    }
  }

  async remove(id: number): Promise<void> {
    const item = await this.orderItemRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException('Order item not found');
    }
    const orderId = item.orderId;
    await this.orderItemRepository.remove(item);
    if (orderId) {
      await this.orderService.update(orderId, {});
    }
  }
  async createOrderItem(orderItemDto: OrderItemDto): Promise<OrderItem> {
    const product = await this.productRepository.findOne({ where: { id: orderItemDto.productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (product.stock < orderItemDto.quantity) {
      throw new NotFoundException('Not enough stock');
    }
    product.stock -= orderItemDto.quantity;
    await this.productRepository.save(product);
    const orderItem = this.orderItemRepository.create({
      ...orderItemDto,
      price: product.price,
      subtotal: product.price * orderItemDto.quantity,
    });
    return this.orderItemRepository.save(orderItem);
  }

  async createOrderItemsBatch(orderItemsDto: OrderItemDto[]): Promise<OrderItem[]> {
    const createdOrderItems: OrderItem[] = [];
    for (const itemDto of orderItemsDto) {
      const product = await this.productRepository.findOne({ where: { id: itemDto.productId } });
      if (!product) {
        throw new NotFoundException(`Product with id ${itemDto.productId} not found`);
      }
      if (product.stock < itemDto.quantity) {
        throw new NotFoundException(`Not enough stock for product ${product.name}`);
      }
      product.stock -= itemDto.quantity;
      await this.productRepository.save(product);
      const orderItem = this.orderItemRepository.create({
        ...itemDto,
        price: product.price,
        subtotal: product.price * itemDto.quantity,
      });
      createdOrderItems.push(await this.orderItemRepository.save(orderItem));
    }
    return createdOrderItems;
  }

  async restoreStock(orderItemId: number): Promise<void> {
    const orderItem = await this.orderItemRepository.findOne({ where: { id: orderItemId }, relations: ['product'] });
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }
    const product = await this.productRepository.findOne({ where: { id: orderItem.productId } });
    if (product) {
      product.stock += orderItem.quantity;
      await this.productRepository.save(product);
    }
  }
}
