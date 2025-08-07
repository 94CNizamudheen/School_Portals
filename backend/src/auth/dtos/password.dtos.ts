import { IsEmail, IsOptional, IsString, MinLength } from "class-validator"


export class ForgotPasswordDto{
    @IsEmail()email:string
}

export class ResetPasswordDto{
    @IsOptional() @IsEmail()email?:string
    @IsString() @MinLength(6, { message: 'Password must be at least 6 characters' })password: string;
    @IsOptional() @IsString()identity?: string;
}

export class VerifyOtpDto{

    @IsEmail()email:string
    @IsString()code:string
}

export class StudentGenarteOtpDto{
    @IsEmail() email:string;
    @IsString() identity:string;
}