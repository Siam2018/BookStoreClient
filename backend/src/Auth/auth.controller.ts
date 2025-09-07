import { Controller, Post, Request, UseGuards, Body, HttpException, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';

import { JwtAuthGuard } from './jwtAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: { identifier: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    // identifier can be email (customer or admin) or username (admin)
    const user = await this.authService.validateUser(body.identifier, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const loginResult = await this.authService.login(user);
    res.cookie('token', loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    });
    return { role: loginResult.role };
  }
}
