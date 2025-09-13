
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { Public } from './public.decorator';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

