
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";
export enum Role {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    PARENT = "PARENT",
    GUEST = 'GUEST'
};

export class RegisterDto {
    @IsString()
    name: string

    @IsEmail()
    email: string

    @IsString()
    @MinLength(6)
    password: string

    @IsEnum(Role)
    role: Role
    
    @IsOptional()
    @IsString()
    profileId?: string;
}

