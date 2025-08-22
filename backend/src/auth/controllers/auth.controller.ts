import { BadRequestException, Body, Controller, Get, Logger, Param, Post, Req } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dtos/register.dtos';
import { SignInDto } from '../dtos/signin.dto';
import { ResetPasswordDto, StudentGenarteOtpDto, VerifyOtpDto } from '../dtos/password.dtos';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)
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
  refresh(@Body('refreshToken') refresh_token: string) {
    this.logger.log("refresh invoked with token", refresh_token)
    return this.authService.refreshToken(refresh_token)
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    this.logger.log("Logout invoked")
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
    this.logger.debug('reset password with ',JSON.stringify(dto))
    return await this.authService.resetPassword(dto);

  }

  @Post('google-login')
  googleLogin(@Body() body: { email: string, name: string, role: string }) {
    return this.authService.handleGoogleLogin(body);
  }
  @Post('generate-student-otp')
  generateStudentOtp(@Body() body: StudentGenarteOtpDto) {

    return this.authService.generateStudentOtp(body)
  }
  @Post('send-student-password')
  sendStudentPassword(@Body()body:StudentGenarteOtpDto){
    return this.authService.sendStudentPassword(body);
  }

}
