import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UsePipes, ValidationPipe, UploadedFile, Res, ParseIntPipe, Query, Patch, UseGuards, Req } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { MailService } from '../Mail/mail.service';
import { Public } from '../Auth/public.decorator';
import { JwtAuthGuard } from '../Auth/jwtAuth.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { CustomerDto, UpdateCustomerStatusDto } from './customer.dto';
import { MulterError, diskStorage } from 'multer';
import { Roles, RolesGuard } from 'src/Auth/roles.guard';
import { publicDecrypt } from 'crypto';


@Controller('customer')
export class CustomerController {
    constructor(
        private readonly customerService: CustomerService,
        private readonly mailService: MailService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async findAll() {
        try {
            const customers = await this.customerService.getAllCustomers();
            return {
                message: 'Get all customers',
                data: customers,
                status: 'success'
            };
        } catch (error) {
            throw new (error.status && error.status === 404 ? error.constructor : require('@nestjs/common').HttpException)(
                error.message || 'Failed to get customers',
                error.status || 500
            );
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        try {
            const customer = await this.customerService.getCustomerById(id);
            return {
                message: `Get customer with ID: ${id}`,
                data: customer,
                status: 'success'
            };
        } catch (error) {
            throw new (error.status && error.status === 404 ? error.constructor : require('@nestjs/common').HttpException)(
                error.message || 'Customer not found',
                error.status || 500
            );
        }
    }

    @Public()
    @Post('/addcustomer')
    @UsePipes(new ValidationPipe())
    async addCustomer(@Body() customerData: CustomerDto) {
        try {
            const newCustomer = await this.customerService.addCustomer(customerData);
            // Send welcome email
            await this.mailService.sendMail(
                newCustomer.email,
                'Welcome to BookStore!',
                `Hello ${newCustomer.fullName},\n\nThank you for registering at BookStore!`
            );
            return {
                message: 'Customer added successfully',
                data: newCustomer,
                status: 'success'
            };
        } catch (error) {
            throw new (error.status && error.status === 400 ? error.constructor : require('@nestjs/common').HttpException)(
                error.message || 'Failed to add customer',
                error.status || 500
            );
        }
    }

    @Put('/:id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @UsePipes(new ValidationPipe())
    async updateCustomerStatus(
        @Param('id', ParseIntPipe) id: number, 
        @Body() statusData: UpdateCustomerStatusDto,
        @Req() req
    ) {
        const user = req.user;
        if (user.role !== 'admin') {
            throw new (require('@nestjs/common').ForbiddenException)(
                'Only admin can update customer status.'
            );
        }
        try {
            const updatedCustomer = await this.customerService.updateCustomerStatus(id, statusData);
            return {
                message: 'Customer status updated successfully',
                data: updatedCustomer,
                status: 'success'
            };
        } catch (error) {
            throw new (error.status && error.status === 404 ? error.constructor : require('@nestjs/common').HttpException)(
                error.message || 'Failed to update customer status',
                error.status || 500
            );
        }
    }

    @Get('/status/inactive')
    async getInactiveCustomers() {
        try {
            const inactiveCustomers = await this.customerService.getInactiveCustomers();
            return {
                message: 'Retrieved inactive customers',
                data: inactiveCustomers,
                status: 'success'
            };
        } catch (error) {
            throw new (error.status && error.status === 404 ? error.constructor : require('@nestjs/common').HttpException)(
                error.message || 'Failed to get inactive customers',
                error.status || 500
            );
        }
    }

    @Get('/status/active')
    async getActiveCustomers() {
        try {
            const activeCustomers = await this.customerService.getActiveCustomers();
            return {
                message: 'Retrieved active customers',
                data: activeCustomers,
                status: 'success'
            };
        } catch (error) {
            throw new (error.status && error.status === 404 ? error.constructor : require('@nestjs/common').HttpException)(
                error.message || 'Failed to get active customers',
                error.status || 500
            );
        }
    }

    @Get('/age/older-than/:minAge')
    async getCustomersOlderThan(@Param('minAge', ParseIntPipe) minAge: number) {
        const customers = await this.customerService.getCustomersOlderThan(minAge);
        return {
            message: `Retrieved customers older than ${minAge}`,
            data: customers,
            status: 'success'
        };
    }

    // Get customers by age range
    @Get('/age/range')
    async getCustomersByAge(
        @Query('minAge', ParseIntPipe) minAge: number,
        @Query('maxAge') maxAge?: string
    ) {
        const customers = await this.customerService.getCustomersByAge(minAge, maxAge ? parseInt(maxAge) : undefined);
        return {
            message: `Retrieved customers by age range`,
            data: customers,
            status: 'success'
        };
    }

    @Get('/city/:city')
    async getCustomersByCity(@Param('city') city: string) {
        const customers = await this.customerService.getCustomersByCity(city);
        return {
            message: `Retrieved customers from city: ${city}`,
            data: customers,
            status: 'success'
        };
    }

    @Get('/gender/:gender')
    async getCustomersByGender(@Param('gender') gender: string) {
        const customers = await this.customerService.getCustomersByGender(gender);
        return {
            message: `Retrieved customers by gender: ${gender}`,
            data: customers,
            status: 'success'
        };
    }

    @Get('/search/:searchTerm')
    async searchCustomersByName(@Param('searchTerm') searchTerm: string) {
        const customers = await this.customerService.searchCustomersByName(searchTerm);
        return {
            message: `Search results for: ${searchTerm}`,
            data: customers,
            status: 'success'
        };
    }

    @Put('/:id/toggle-status')
    @UseGuards(JwtAuthGuard)
    async toggleCustomerStatus(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const user = req.user;
        if (user.role !== 'admin' && user.userId !== id) {
            throw new (require('@nestjs/common').ForbiddenException)(
                'You can only toggle your own status.'
            );
        }
        const customer = await this.customerService.toggleCustomerStatus(id);
        return {
            message: 'Customer status toggled successfully',
            data: customer,
            status: 'success'
        };
    }

    @Put('/:id')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true,transform: true}))
    async updateCustomer(
        @Param('id', ParseIntPipe) id: number, 
        @Body() updateData: Partial<CustomerDto>,
        @Req() req
    ) {
        const user = req.user;
        if (user.role !== 'admin' && user.userId !== id) {
            throw new (require('@nestjs/common').ForbiddenException)(
                'You can only update your own profile.'
            );
        }
        const updatedCustomer = await this.customerService.updateCustomer(id, updateData);
        return {
            message: 'Customer updated successfully',
            data: updatedCustomer,
            status: 'success'
        };
    }

    @Delete('/:id')
    @UseGuards(JwtAuthGuard)
    async deleteCustomer(@Param('id', ParseIntPipe) id: number, @Req() req) {
        const user = req.user;
        if (user.role !== 'admin' && user.userId !== id) {
            throw new (require('@nestjs/common').ForbiddenException)(
                'You can only delete your own profile.'
            );
        }
        await this.customerService.deleteCustomer(id);
        return {
            message: 'Customer deleted successfully',
            status: 'success'
        };
    }

    
    @Patch('/:id/image')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads/customers',
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
        @UploadedFile() file: Express.Multer.File,
        @Req() req
    ) {
        const user = req.user;
        if (user.role !== 'admin' && user.userId !== id) {
            throw new (require('@nestjs/common').ForbiddenException)(
                'You can only update your own image.'
            );
        }
        if (!file) {
            return { message: 'No file uploaded', status: 'error' };
        }
        const imageURL = `/uploads/customers/${file.filename}`;
        const updated = await this.customerService.updateCustomerImage(id, imageURL);
        return {
            message: 'Customer image uploaded successfully',
            data: updated,
            status: 'success',
            imageURL,
        };
    }

    @Get('/:id/image')
    async getCustomerImage(@Param('id', ParseIntPipe) id: number, @Res() res) {
        const imagePath = await this.customerService.getCustomerImagePath(id);
        if (!imagePath) {
            return res.status(404).json({ message: 'No image found for this customer.' });
        }
        // Remove leading slash if present
        const normalizedPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        return res.sendFile(normalizedPath, { root: './' });
    }
}
