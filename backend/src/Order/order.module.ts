import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderEntity } from './order.entity';
import { OrderItem } from '../OrderItem/orderItem.entity';
import { ProductEntity } from '../Products/product.entity';
import { forwardRef } from '@nestjs/common';
import { OrderItemModule } from '../OrderItem/orderItem.module';
import { OrderItemService } from '../OrderItem/orderItem.service';

@Module({
    imports: [TypeOrmModule.forFeature([OrderEntity, OrderItem, ProductEntity]), forwardRef(() => OrderItemModule)],
    controllers: [OrderController],
    providers: [OrderService, OrderItemService],
    exports: [OrderService],
})
export class OrderModule {}