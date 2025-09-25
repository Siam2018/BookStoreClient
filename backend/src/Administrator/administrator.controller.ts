
import { Controller, Get, Post, Put, Patch, Delete, Param, Body, UsePipes, ValidationPipe, UploadedFile, UseInterceptors, Res, Query, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AdministratorService } from './administrator.service';
import { AdministratorDto } from './administrator.dto';
import { JwtAuthGuard } from '../Auth/jwtAuth.guard';
import { Roles, RolesGuard } from '../Auth/roles.guard';
import { Public } from 'src/Auth/public.decorator';

@Controller('administrator')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('administrator')
export class AdministratorController {
    constructor(private readonly adminService: AdministratorService) {}

    @Post('create')
    @UsePipes(new ValidationPipe())
    async create(@Body() dto: AdministratorDto) {
        return this.adminService.createAdministrator(dto);
    }

    @Get()
    async findAll(@Query('fullName') fullName?: string) {
        if (fullName) {
            return this.adminService.findByFullNameSubstring(fullName);
        }
        return this.adminService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.adminService.findById(id);
    }

    @Get('username/:username')
    async findByUsername(@Param('username') username: string) {
        return this.adminService.findByUsername(username);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: Partial<AdministratorDto>) {
        return this.adminService.update(id, dto);
    }

    @Put('username/:username')
    async updateByUsername(@Param('username') username: string, @Body() updateData: Partial<AdministratorDto>) {
        return this.adminService.updateByUsername(username, updateData);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.adminService.remove(id);
        return { message: 'Administrator deleted' };
    }

    @Delete('username/:username')
    async removeByUsername(@Param('username') username: string) {
        await this.adminService.removeByUsername(username);
        return { message: 'Administrator deleted by username' };
    }

    // Reset password endpoint
    @Patch(':id/reset-password')
    async resetPassword(@Param('id') id: string, @Body('password') password: string) {
        return this.adminService.resetPassword(id, password);
    }

    // Update role endpoint
    @Patch(':id/role')
    async updateRole(@Param('id') id: string, @Body('role') role: string) {
        return this.adminService.update(id, { role });
    }

    // Get audit logs (basic, for demonstration)
    @Get('audit/logs')
    async getAuditLogs(@Query('limit') limit?: number) {
        return this.adminService.getAuditLogs(limit);
    }

    // Upload profile image
    @Patch('username/:username/image')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                cb(null, Date.now() + '-' + file.originalname);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (file.originalname.match(/^.*\.(jpg|jpeg|png|webp)$/)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file type'), false);
            }
        },
        limits: { fileSize: 1000000 }
    }))
    async updateImage(@Param('username') username: string, @UploadedFile() file: Express.Multer.File) {
        return this.adminService.updateByUsername(username, { imageURL: `/uploads/${file.filename}` });
    }

    // Serve uploaded file
    @Get('getfile/:filename')
    getFile(@Param('filename') filename: string, @Res() res) {
        return res.sendFile(filename, { root: './uploads' });
    }
}
