import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service'; 
import { RegisterDto } from '../dtos/register.dtos'; 
import { SignInDto } from '../dtos/signin.dto';
import { ResetPasswordDto, VerifyOtpDto } from '../dtos/password.dtos';

@Controller('auth')
export class AuthController {
  private readonly logger= new Logger(AuthService.name)

  constructor(private readonly authService: AuthService) {}


  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: SignInDto) {
     this.logger.log(`login invoked with ${JSON.stringify(dto)}`)
    return this.authService.signIn(dto);
   
  }

  @Post('otp/generate')
  async generateOtp(@Body() body: { email: string }) {
    return this.authService.sendOtp(body.email);
  }

  @Post('otp/verify')
  async verifyOtp(@Body() dto:VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('reset-password')
  async resetPassword(@Body()dto:ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { message: 'Password updated successfully' };
  }
  @Get(":id")
  async fetchUser(@Param('id')id:string){
    return await this.authService.fetchUser(id)
  }
  @Post('google-login')
  async googleLogin(@Body()body:{email:string,name:string,role:string}){
    return this.authService.handleGoogleLogin(body);
  }
}
