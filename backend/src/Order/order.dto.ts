import { IsNumber, IsString, IsArray, IsDateString, IsOptional, IsPositive, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemDto } from '../OrderItem/orderItem.dto';

export class OrderDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsNumber({}, { message: 'Customer ID must be a number' })
    @IsOptional()
    customerId?: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    @IsOptional()
    orderItems?: OrderItemDto[];

    @IsNumber({}, { message: 'Total must be a number' })
    @IsPositive({ message: 'Total must be a positive number' })
    @IsOptional()
    total?: number;

    @IsString({ message: 'Status must be a string' })
    @IsNotEmpty({ message: 'Status is required' })
    status: string;

    @IsDateString()
    @IsOptional()
    createdAt?: string;

    @IsDateString()
    @IsOptional()
    updatedAt?: string;
}