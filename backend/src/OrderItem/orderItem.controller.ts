import { Controller, Get, Post, Put, Delete, Patch, Param, Body, UsePipes, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { OrderItemService } from './orderItem.service';
import { OrderItemDto } from './orderItem.dto';

@Controller('orderItems')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Get()
  async findAll() {
    const items = await this.orderItemService.findAll();
    return {
      message: 'Get all order items',
      data: items,
      status: 'success',
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const item = await this.orderItemService.findOne(id);
    return {
      message: `Get order item with ID: ${id}`,
      data: item,
      status: 'success',
    };
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: OrderItemDto | OrderItemDto[]) {
    if (Array.isArray(dto)) {
      const items = await this.orderItemService.createMany(dto);
      return {
        message: 'Order items created successfully',
        data: items,
        status: 'success',
      };
    } else {
      const newItem = await this.orderItemService.create(dto);
      return {
        message: 'Order item created successfully',
        data: newItem,
        status: 'success',
      };
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: OrderItemDto) {
    const updated = await this.orderItemService.update(id, dto);
    return {
      message: 'Order item updated successfully',
      data: updated,
      status: 'success',
    };
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async patch(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<OrderItemDto>) {
    const updated = await this.orderItemService.update(id, dto);
    return {
      message: 'Order item patched successfully',
      data: updated,
      status: 'success',
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.orderItemService.remove(id);
    return { message: 'Order item deleted successfully', status: 'success' };
  }
}
