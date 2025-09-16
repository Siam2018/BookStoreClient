import { Controller, Get, Param, Post, UsePipes, ValidationPipe, Body, Put, Delete, Patch, UseInterceptors, UploadedFile, Res, UseGuards, Req } from '@nestjs/common';
import { Roles, RolesGuard } from '../Auth/roles.guard';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../Auth/jwtAuth.guard';
import { Public } from '../Auth/public.decorator';
import { OrderDto } from './order.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Body() body: any, @Param() params: any, @Req() req: any) {
    // If admin, fetch all orders. Otherwise, filter by customerId
    if (req.user?.role === 'admin') {
      return await this.orderService.findAll();
    }
    const customerId = req.user?.id || req.user?.customerId;
    return await this.orderService.findAll(customerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: any) {
    const customerId = req.user?.id || req.user?.customerId;
    return await this.orderService.findOne(+id, customerId);
  }


  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: OrderDto, @Req() req: any) {
    let customerId = req.user?.id ?? req.user?.customerId ?? req.user?.userId;
    customerId = Number(customerId);
    const orderPayload = { ...dto, customerId };
    return await this.orderService.create(orderPayload);
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
