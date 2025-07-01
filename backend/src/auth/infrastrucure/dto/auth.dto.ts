
import { IsEmail, IsEnum, IsString } from "class-validator";
export enum Role{
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    PARENT = "PARENT"
};

export class RegisterDto{
    @IsEmail()
    email:string
    @IsString()
    password:string
    @IsEnum(Role)
    role:Role
}

export class SignInDto{
    @IsEmail()
    email:string
    @IsString()
    password:string
}
export class ForgotPasswordDto{
    @IsEmail()
    email:string
}
export class ResetPasswordDto{
    @IsEmail()
    email:string
    @IsString()
    otp:string
    @IsString()
    newPassword:string
}
export class VerifyOtpDto{
    @IsEmail()
    email:string
    @IsString()
    code:string
}

