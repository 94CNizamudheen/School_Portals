
import { Controller,Post,Body } from "@nestjs/common";
import { AuthService } from "../application/auth.service";
import { RegisterDto,SignInDto,ForgotPasswordDto,ResetPasswordDto,VerifyOtpDto, } from "./dto/auth.dto";


@Controller ('auth')
export class AuthController{
    constructor(private authservice:AuthService){}
    @Post('register')
    async register(@Body()dto:RegisterDto){
        return this.authservice.register(dto);
    };
    @Post('signin')
    async signin(@Body()dto:SignInDto){
        return this.authservice.signIn(dto);
    }
    @Post('forgot-password')
    async forgotPassword(@Body()dto:ForgotPasswordDto){
        return this.authservice.forgetPassword(dto);
    };
    @Post('reset-password')
    async resetPassword(@Body()dto:ResetPasswordDto){
        return this.authservice.resetPassword(dto);
    };
    @Post('verify-otp')
    async veryfyOtp(@Body()dto:VerifyOtpDto){
        return this.authservice.verifyOtp
    }
    @Post('send-otp')
    async sendOtp(@Body('email')email:string){
        return this.authservice.sendOtp(email);
    }
    @Post('resend-otp')
    async resendOtp(@Body('email')email:string){
        return this.authservice.resendOtp(email);
    }
}