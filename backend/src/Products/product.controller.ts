import { Controller, Get, Post, Put, Delete, Patch, Param, Body, UsePipes, ValidationPipe, ParseIntPipe, UseInterceptors, UploadedFile, Res, UseGuards } from '@nestjs/common';
import { Public } from '../Auth/public.decorator';
import { Roles, RolesGuard } from '../Auth/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductService } from './product.service';

import { JwtAuthGuard } from '../Auth/jwtAuth.guard';
import { ProductDto } from './product.dto';

// JwtAuthGuard will be applied only to protected endpoints
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get(':id/image')
  async getProductImage(@Param('id', ParseIntPipe) id: number, @Res() res) {
    const imagePath = await this.productService.getProductImagePath(id);
    if (!imagePath) {
      return res.status(404).json({ message: 'No image found for this product.' });
    }
    // Remove leading slash if present
    const normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return res.sendFile(normalizedPath, { root: './' });
  }

  @Public()
  @Get()
  async findAll() {
    const products = await this.productService.getAllProducts();
    return {
      message: 'Get all products',
      data: products,
      status: 'success'
    };
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const product = await this.productService.getProductById(id);
    return {
      message: `Get product with ID: ${id}`,
      data: product,
      status: 'success'
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: ProductDto) {
    const newProduct = await this.productService.addProduct(dto);
    return {
      message: 'Product added successfully',
      data: newProduct,
      status: 'success'
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UsePipes(new ValidationPipe())
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: ProductDto) {
    const updated = await this.productService.updateProduct(id, dto);
    return {
      message: 'Product updated successfully',
      data: updated,
      status: 'success'
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UsePipes(new ValidationPipe())
  async patch(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<ProductDto>) {
    const updated = await this.productService.updateProduct(id, dto);
    return {
      message: 'Product patched successfully',
      data: updated,
      status: 'success'
    };
  }

  @Patch(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/products',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/^image\/(jpg|jpeg|png|webp)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 },
  }))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      return { message: 'No file uploaded', status: 'error' };
    }
    const imageURL = `/uploads/products/${file.filename}`;
    const updated = await this.productService.updateProduct(id, { imageURL });
    return {
      message: 'Product image uploaded successfully',
      data: updated,
      status: 'success',
      imageURL,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.productService.deleteProduct(id);
    return {
      message: 'Product deleted successfully',
      data: deleted,
      status: 'success'
    };
  }
}
