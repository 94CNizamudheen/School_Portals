import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  studentIdentity?:string;

  @IsEmail()
  email?: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsString()
  role:string
}
