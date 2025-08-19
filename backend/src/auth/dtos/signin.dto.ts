import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @IsOptional() @IsString()
  studentIdentity?:string;

  @IsOptional() @IsEmail()
  email?: string;

 @IsOptional() @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  role:string
}
