
import { IsEmail, IsEnum, IsString } from "class-validator";
export enum Role{
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
    PARENT = "PARENT",
    GUEST = 'GUEST'
};

export class RegisterDto{
    @IsEmail()
    email:string
    @IsString()
    password:string
    @IsEnum(Role)
    role:Role
}

