import { IsNumber, IsString, IsArray, IsDateString, IsOptional, IsPositive, IsNotEmpty } from 'class-validator';

export class OrderDto {
    @IsNumber()
    @IsOptional()
    id?: number;

    @IsNumber({}, { message: 'Customer ID must be a number' })
    @IsNotEmpty({ message: 'Customer ID is required' })
    customerId: number;

    @IsArray()
    @IsOptional()
    orderItems?: number[];

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