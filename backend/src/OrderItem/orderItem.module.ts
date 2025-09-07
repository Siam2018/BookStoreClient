import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemController } from './orderItem.controller';
import { OrderItemService } from './orderItem.service';
import { OrderItem } from './orderItem.entity';


import { ProductEntity } from '../Products/product.entity';
import { OrderModule } from '../Order/order.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, ProductEntity]), OrderModule],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})
export class OrderItemModule {}
