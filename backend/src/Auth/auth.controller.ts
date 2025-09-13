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
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    });
    return { message: 'Logged out successfully' };
  }

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
    console.log('Login successful, setting cookie:', {
      token: loginResult.access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.cookie('token', loginResult.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
    });
    console.log('Cookie set, response headers:', res.getHeaders());
    return { role: loginResult.role };
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req, @Res() res: Response) {
    try {
      console.log('AuthController /auth/me: req.cookies:', req.cookies);
      console.log('AuthController /auth/me: req.user:', req.user);
      if (!req.user) {
        console.error('No user found in request');
        return res.status(401).json({ error: 'Unauthorized: No user found' });
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
      console.log('Returning user info:', userInfo);
      return res.json(userInfo);
    } catch (err) {
      console.error('Error in /auth/me:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}

