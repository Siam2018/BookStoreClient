import { Controller, Get, Param, Post, UsePipes, ValidationPipe, Body, Put, Delete, Patch, UseInterceptors, UploadedFile, Res, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';

import { JwtAuthGuard } from '../Auth/jwtAuth.guard';
import { OrderDto } from './order.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async findAll() {
    return await this.orderService.findAll();
}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(+id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: OrderDto) {
    return await this.orderService.create(dto);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(@Param('id') id: string, @Body() dto: OrderDto) {
    return await this.orderService.update(+id, dto);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  async patch(@Param('id') id: string, @Body() dto: Partial<OrderDto>) {
    return await this.orderService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.orderService.remove(+id);
    return { message: 'Order deleted successfully' };
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
        cb(null, true);
      else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: { fileSize: 30000 },
    storage: diskStorage({
      destination: './uploads',
      filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
      },
    })
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return `Uploaded file: ${file.originalname}`;
  }

  @Get('/getfile/:filename')
  getFile(@Param('filename') filename, @Res() res) {
    res.sendFile(filename, { root: './uploads' });
  }
}
