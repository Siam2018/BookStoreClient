import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from './admin.entity';
import { AdminDto } from './admin.dto';

@Injectable()
export class AdminService {
    async updateByUsername(username: string, updatedAdmin: Partial<AdminDto>): Promise<AdminEntity | null> {
        try {
            const admin = await this.adminRepository.findOneBy({ username });
            if (!admin) {
                throw new ConflictException('Username does not exist');
            }
            await this.adminRepository.update({ username }, updatedAdmin);
            return this.adminRepository.findOneBy({ username });
        } catch (error) {
            throw new (error.constructor || require('@nestjs/common').HttpException)(
                error.message || 'Failed to update admin by username',
                error.status || 500
            );
        }
    }
    constructor(
        @InjectRepository(AdminEntity)
        private adminRepository: Repository<AdminEntity>,
    ) {}

    async createAdmin(admin: AdminDto): Promise<AdminEntity> {
        const existing = await this.adminRepository.findOneBy({ username: admin.username });
        if (existing) {
            throw new ConflictException('Username already exists');
        }
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(admin.password, saltRounds);
        const entity = this.adminRepository.create({ ...admin, password: hashedPassword });
        return this.adminRepository.save(entity);
    }

    async getAllAdmins(): Promise<AdminEntity[]> {
        return this.adminRepository.find();
    }

    async getAdminById(id: string): Promise<AdminEntity | null> {
        return this.adminRepository.findOneBy({ id });
    }

    async updateAdmin(id: string, updatedAdmin: Partial<AdminDto>): Promise<AdminEntity | null> {
        try {
            await this.adminRepository.update(id, updatedAdmin);
            return this.adminRepository.findOneBy({ id });
        } catch (error) {
            throw new (error.constructor || require('@nestjs/common').HttpException)(
                error.message || 'Failed to update admin',
                error.status || 500
            );
        }
    }

    async deleteAdmin(id: string): Promise<void> {
        await this.adminRepository.delete(id);
    }
    async findByFullNameSubstring(substring: string): Promise<AdminEntity[]> {
        return this.adminRepository.createQueryBuilder('admin')
            .where('admin.fullName ILIKE :substring', { substring: `%${substring}%` })
            .getMany();
    }

    async findByUsername(username: string): Promise<AdminEntity> {
        const admin = await this.adminRepository.findOneBy({ username });
        if (!admin) {
            throw new ConflictException('Username does not exist');
        }
        return admin;
    }

    async deleteByUsername(username: string): Promise<void> {
        await this.adminRepository.delete({ username });
    }
}
