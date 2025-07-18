import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service'; 
import { RegisterDto } from '../dtos/register.dtos'; 
import { LoginDto } from '../dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.role);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @Post('otp/generate')
  async generateOtp(@Body() body: { email: string }) {
    return this.authService.generateOtp(body.email);
  }

  @Post('otp/verify')
  async verifyOtp(@Body() body: { email: string; code: string }) {
    return this.authService.verifyOtp(body.email, body.code);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: { email: string; newPassword: string }) {
    await this.authService.resetPassword(body.email, body.newPassword);
    return { message: 'Password updated successfully' };
  }
}
