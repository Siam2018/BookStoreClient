import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from './product.entity';
import { ProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
  ) {}

  // Get product image path by ID
  async getProductImagePath(id: number): Promise<string | null> {
    try {
      const product = await this.getProductById(id);
      return product.imageURL || null;
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get product image path',
        error.status || 500
      );
    }
  }

  async addProduct(productDto: ProductDto): Promise<ProductEntity> {
    try {
      const product = this.productRepository.create(productDto);
      return await this.productRepository.save(product);
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to add product',
        error.status || 500
      );
    }
  }

  async getAllProducts(): Promise<ProductEntity[]> {
    try {
      return await this.productRepository.find();
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get all products',
        error.status || 500
      );
    }
  }

  async getProductById(id: number): Promise<ProductEntity> {
    try {
      const product = await this.productRepository.findOneBy({ id });
      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to get product by ID',
        error.status || 500
      );
    }
  }

  async updateProduct(id: number, updateData: Partial<ProductDto>): Promise<ProductEntity> {
    try {
      await this.productRepository.update(id, updateData);
      return this.getProductById(id);
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to update product',
        error.status || 500
      );
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    try {
      const result = await this.productRepository.delete(id);
      return !!result.affected;
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Failed to delete product',
        error.status || 500
      );
    }
  }
}

