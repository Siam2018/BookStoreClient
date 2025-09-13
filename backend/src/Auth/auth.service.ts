import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from '../Customer/customer.service';
import { AdminService } from '../Admin/admin.service';
import { CustomerEntity } from '../Customer/customer.entity';
import { AdminEntity } from '../Admin/admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, pass: string): Promise<AdminEntity | CustomerEntity> {
    // Try admin by username
    let admin: AdminEntity | null = null;
    try {
      admin = await this.adminService.findByUsername(identifier);
    } catch {}
    if (admin && 'password' in admin && await bcrypt.compare(pass, admin.password)) {
      const { password, ...result } = admin as any;
      return result;
    }
    // Try admin by email
    let adminByEmail: AdminEntity | null = null;
    if (!admin) {
      adminByEmail = await this.adminService['adminRepository']?.findOneBy?.({ email: identifier }) ?? null;
      if (adminByEmail && 'password' in adminByEmail && await bcrypt.compare(pass, adminByEmail.password)) {
        const { password, ...result } = adminByEmail as any;
        return result;
      }
    }
    // Try customer by email
    const customer = await this.customerService.findByEmail(identifier);
    if (customer && 'password' in customer && await bcrypt.compare(pass, customer.password)) {
      const { password, ...result } = customer as any;
      return result;
    }
    throw new (require('@nestjs/common').UnauthorizedException)('Invalid credentials');
  }

  async login(user: any) {
    try {
      if (!user || !user.email || !user.id || !user.role) {
        throw new (require('@nestjs/common').UnauthorizedException)('Invalid user data');
      }
      const payload = {
        email: user.email,
        sub: user.id,
        role: user.role,
        fullName: user.fullName || user.name || user.username || '',
        imageURL: user.imageURL || '',
      };
      return {
        access_token: this.jwtService.sign(payload),
        role: user.role,
      };
    } catch (error) {
      throw new (error.constructor || require('@nestjs/common').HttpException)(
        error.message || 'Login failed',
        error.status || 401
      );
    }
  }
}
