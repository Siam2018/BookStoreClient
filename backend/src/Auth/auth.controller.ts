
import { Controller, Post, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { AdministratorService } from '../Administrator/administrator.service';
import { AdministratorDto } from '../Administrator/administrator.dto';
import { AdminService } from '../Admin/admin.service';
import { AdminDto } from '../Admin/admin.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly administratorService: AdministratorService,
    private readonly adminService: AdminService
  ) {}
  /**
   * ADMIN LOGIN (sets JWT in HttpOnly, Secure cookie)
   */
  @Public()
  @Post('admin/login')
  async adminLogin(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const admin = await this.adminService.findByUsername(body.username);
    if (!admin) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const bcrypt = require('bcrypt');
    const valid = await bcrypt.compare(body.password, admin.password);
    if (!valid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    // Use AuthService to generate JWT
    const loginResult = await this.authService.login(admin);
    res.cookie('admin_jwt', loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });
    const { password, ...adminInfo } = admin;
    return { message: 'Login successful', admin: adminInfo };
  }

  /**
   * ADMIN REGISTRATION
   */
  @Public()
  @Post('admin/register')
  async adminRegister(@Body() dto: AdminDto) {
    return this.adminService.createAdmin(dto);
  }

  /**
   * ADMIN LOGOUT (clears cookie)
   */
  @Public()
  @Post('admin/logout')
  async adminLogout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('admin_jwt');
    return { message: 'Admin logged out successfully' };
  }

  /**
   * ADMINISTRATOR LOGIN (sets JWT in HttpOnly, Secure cookie)
   */
  @Public()
  @Post(['administrator/login'])
  async administratorLogin(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const admin = await this.administratorService.findByUsername(body.username);
    if (!admin) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const bcrypt = require('bcrypt');
    const valid = await bcrypt.compare(body.password, admin.password);
    if (!valid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    // Use AuthService to generate JWT
    const loginResult = await this.authService.login(admin);
    res.cookie('admin_jwt', loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });
    const { password, ...adminInfo } = admin;
    return { message: 'Login successful', admin: adminInfo };
  }

  /**
   * ADMINISTRATOR REGISTRATION
   */
  @Public()
  @Post('administrator/register')
  async administratorRegister(@Body() dto: AdministratorDto) {
    return this.administratorService.createAdministrator(dto);
  }

  /**
   * ADMINISTRATOR LOGOUT (clears cookie)
   */
  @Public()
  @Post('administrator/logout')
  async administratorLogout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('admin_jwt');
    return { message: 'Administrator logged out successfully' };
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: { identifier: string; password: string }
  ) {
    const user = await this.authService.validateUser(body.identifier, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const loginResult = await this.authService.login(user);

    const { password, ...userInfo } = user;
    return { access_token: loginResult.access_token, role: loginResult.role, user: userInfo };
  }

  @Public()
  @Post('logout')
  async logout() {
    // Stateless JWT logout: frontend should clear all localStorage
    return { message: 'Logged out successfully' };
  }
}

