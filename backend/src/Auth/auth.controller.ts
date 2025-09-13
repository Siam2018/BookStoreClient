import { Controller, Post, Request, UseGuards, Body, HttpException, HttpStatus, Res, Get } from '@nestjs/common';
import { Response } from 'express';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwtAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('logout')
  async logout() {
    // For Bearer token, logout is handled on frontend by removing token from storage
    return { message: 'Logged out successfully' };
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: { identifier: string; password: string }
  ) {
    // identifier can be email (customer or admin) or username (admin)
    const user = await this.authService.validateUser(body.identifier, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const loginResult = await this.authService.login(user);
    // Return token and role in response body
  return { access_token: loginResult.access_token, role: loginResult.role, token: loginResult.access_token };
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req) {
    try {
      if (!req.user) {
        return { error: 'Unauthorized: No user found' };
      }
      const userInfo = {
        id: req.user?.id || req.user?.userId,
        userId: req.user?.userId,
        email: req.user?.email,
        role: req.user?.role,
        fullName: req.user?.fullName,
        imageURL: req.user?.imageURL,
        phone: req.user?.phone,
        address: req.user?.address,
        city: req.user?.city,
        postalCode: req.user?.postalCode,
        country: req.user?.country,
        dateOfBirth: req.user?.dateOfBirth,
        gender: req.user?.gender,
        status: req.user?.status,
        isActive: req.user?.isActive,
        createdAt: req.user?.createdAt,
        updatedAt: req.user?.updatedAt,
        username: req.user?.username,
      };
      return userInfo;
    } catch (err) {
      return { error: 'Internal server error' };
    }
  }
}

