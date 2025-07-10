
import { Controller,Post,Body, UseGuards, Get, Param, Req } from "@nestjs/common";
import { AuthService } from "../application/auth.service";
import { RegisterDto,SignInDto,ForgotPasswordDto,ResetPasswordDto,VerifyOtpDto, } from "./dto/auth.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Request } from "express";


@Controller ('auth')
export class AuthController{
    constructor(private authservice:AuthService){};
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
    @UseGuards(JwtAuthGuard)
    @Get('verify-token')
    async verifyToken(@Req() req:Request){
        console.log(req.headers)
        return {
            valid:true,
            user:req.user,
        }
    }

}