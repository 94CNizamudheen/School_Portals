
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
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
    password: string
    @IsEnum(Role)
    role: Role
    @IsOptional()
    @IsString()
    profileId?: string;
}

