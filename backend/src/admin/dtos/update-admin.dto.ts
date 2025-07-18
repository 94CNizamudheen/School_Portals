import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  mobileNumber?: string;
}
