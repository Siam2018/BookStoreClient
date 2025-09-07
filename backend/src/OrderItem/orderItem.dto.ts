import { IsNumber, IsOptional, IsPositive, Min, IsNotEmpty } from 'class-validator';

export class OrderItemDto {
  @IsNumber({}, { message: 'Order ID must be a number' })
  @IsPositive({ message: 'Order ID must be positive' })
  @IsNotEmpty({ message: 'Order ID is required' })
  orderId: number;

  @IsNumber({}, { message: 'Product ID must be a number' })
  @IsPositive({ message: 'Product ID must be positive' })
  @IsNotEmpty({ message: 'Product ID is required' })
  productId: number;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @IsNotEmpty({ message: 'Quantity is required' })
  quantity: number;

  @IsNumber({}, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  @IsNotEmpty({ message: 'Price is required' })
  price: number;

  @IsNumber({}, { message: 'Subtotal must be a number' })
  @IsPositive({ message: 'Subtotal must be positive' })
  @IsNotEmpty({ message: 'Subtotal is required' })
  subtotal: number;
}

