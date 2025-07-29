import { BadRequestException, Body, Controller, Get, Logger, Param, Post, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dtos';
import { SignInDto } from '../dtos/signin.dto';
import { ResetPasswordDto, VerifyOtpDto } from '../dtos/password.dtos';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthService.name)

  constructor(private readonly authService: AuthService) { }


  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  };


  @Post('login')
  login(@Body() dto: SignInDto) {
    this.logger.log(`login invoked with ${JSON.stringify(dto)}`)
    return this.authService.signIn(dto);
  };
  @Post('refresh')
  refresh(@Body('refresh_token')token:string){
    return this.authService.refreshToken(token)
  }



  @Post('logout')
  async logout(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) throw new BadRequestException("No token provided");
    await this.authService.logout(token);
    return { message: 'Logged out successfully' }
  };

  @Post('generate-otp')
  generateOtp(@Body() body: { email: string }) {
    return this.authService.sendOtp(body.email);
  }

  @Post('verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { message: 'Password updated successfully' };
  }
  @Get(":id")
  async fetchUser(@Param('id') id: string) {
    return await this.authService.fetchUser(id)
  }
  @Post('google-login')
  googleLogin(@Body() body: { email: string, name: string, role: string }) {
    return this.authService.handleGoogleLogin(body);
  }
}
