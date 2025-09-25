
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdministratorEntity } from './administrator.entity';
import { AdministratorDto } from './administrator.dto';

@Injectable()
export class AdministratorService {
    private auditLogs: any[] = [];
    constructor(
        @InjectRepository(AdministratorEntity)
        private adminRepo: Repository<AdministratorEntity>,
    ) {}

    async findByUsername(username: string): Promise<AdministratorEntity | null> {
        return this.adminRepo.findOneBy({ username });
    }

    async createAdministrator(dto: AdministratorDto): Promise<AdministratorEntity> {
        const existing = await this.adminRepo.findOneBy({ username: dto.username });
        if (existing) throw new ConflictException('Username already exists');
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const entity = this.adminRepo.create({ ...dto, password: hashedPassword });
        this.addAuditLog('create', entity.username, 'Administrator created');
        return this.adminRepo.save(entity);
    }

    async findAll(): Promise<AdministratorEntity[]> {
        return this.adminRepo.find();
    }

    async findById(id: string): Promise<AdministratorEntity | null> {
        return this.adminRepo.findOneBy({ id });
    }

    async update(id: string, dto: Partial<AdministratorDto>): Promise<AdministratorEntity | null> {
        await this.adminRepo.update(id, dto);
        this.addAuditLog('update', id, 'Administrator updated');
        return this.adminRepo.findOneBy({ id });
    }

    async remove(id: string): Promise<void> {
        await this.adminRepo.delete(id);
        this.addAuditLog('delete', id, 'Administrator deleted');
    }

    async resetPassword(id: string, password: string): Promise<{ message: string }> {
        const admin = await this.findById(id);
        if (!admin) throw new NotFoundException('Administrator not found');
        const bcrypt = require('bcrypt');
        const hashedPassword = await bcrypt.hash(password, 10);
        await this.adminRepo.update(id, { password: hashedPassword });
        this.addAuditLog('resetPassword', id, 'Password reset');
        return { message: 'Password reset successfully' };
    }

    async findByFullNameSubstring(fullName: string): Promise<AdministratorEntity[]> {
        return this.adminRepo.createQueryBuilder('administrator')
            .where('administrator.fullName LIKE :name', { name: `%${fullName}%` })
            .getMany();
    }

    async updateByUsername(username: string, updateData: Partial<AdministratorDto>): Promise<AdministratorEntity | null> {
        const admin = await this.adminRepo.findOneBy({ username });
        if (!admin) throw new NotFoundException('Username does not exist');
        await this.adminRepo.update({ username }, updateData);
        this.addAuditLog('update', username, 'Administrator updated by username');
        return this.adminRepo.findOneBy({ username });
    }

    async removeByUsername(username: string): Promise<void> {
        await this.adminRepo.delete({ username });
        this.addAuditLog('delete', username, 'Administrator deleted by username');
    }

    getAuditLogs(limit?: number) {
        if (limit) return this.auditLogs.slice(-limit);
        return this.auditLogs;
    }

    private addAuditLog(action: string, target: string, message: string) {
        this.auditLogs.push({
            timestamp: new Date().toISOString(),
            action,
            target,
            message
        });
    }
}
