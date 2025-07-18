import { IsEmail, IsString } from "class-validator"


export class ForgotPasswordDto{
    @IsEmail()email:string
}

export class ResetPasswordDto{
    @IsEmail()email:string
    @IsString()otp:string
    @IsString()newPassword:string
}

export class VerifyOtpDto{

    @IsEmail()email:string
    @IsString()code:string
}
