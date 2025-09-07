import { IsString, IsNumber, IsOptional, IsBoolean, IsNotEmpty, IsDecimal, IsPositive, MinLength, MaxLength } from 'class-validator';

export class ProductDto {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description is required' })
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number' })
  @IsPositive({ message: 'Price must be positive' })
  price: number;

  @IsNumber({}, { message: 'Stock must be a number' })
  @IsNotEmpty({ message: 'Stock is required' })
  stock: number;

  @IsString({ message: 'Category must be a string' })
  @IsNotEmpty({ message: 'Category is required' })
  category: string;

  @IsString()
  @IsOptional()
  imageURL?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  author?: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  weight?: number;
}
