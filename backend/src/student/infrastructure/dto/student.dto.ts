
import { IsEmail, IsString, IsOptional, IsDateString, IsArray, IsMongoId } from "class-validator";

export class CreateStudentDto {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsEmail() email: string;
  @IsString() mobileNumber: string;
  @IsOptional() @IsDateString() dateOfBirth?: Date;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() bloodGroup?: string;
  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsString() religion?: string;
  @IsOptional() @IsString() grade?: string;
  @IsOptional() @IsString() class?: string;
  @IsOptional() @IsString() rollNumber?: string;
  @IsOptional() @IsString() previousSchool?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() pincode?: string;
  @IsOptional() @IsString() medicalConditions?: string;
  @IsOptional() @IsString() allergies?: string;
  @IsOptional() @IsString() medications?: string;
  @IsOptional() @IsString() profileImage?: string;
  @IsOptional() @IsArray() @IsMongoId({ each: true }) parentIds?: string[];
}

// update-student.dto.ts
export class UpdateStudentDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() mobileNumber?: string;
  @IsOptional() @IsDateString() dateOfBirth?: Date;
  @IsOptional() @IsString() gender?: string;
  @IsOptional() @IsString() bloodGroup?: string;
  @IsOptional() @IsString() nationality?: string;
  @IsOptional() @IsString() religion?: string;
  @IsOptional() @IsString() grade?: string;
  @IsOptional() @IsString() class?: string;
  @IsOptional() @IsString() rollNumber?: string;
  @IsOptional() @IsString() previousSchool?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() state?: string;
  @IsOptional() @IsString() pincode?: string;
  @IsOptional() @IsString() medicalConditions?: string;
  @IsOptional() @IsString() allergies?: string;
  @IsOptional() @IsString() medications?: string;
  @IsOptional() @IsString() profileImage?: string;
  @IsOptional() @IsArray() @IsMongoId({ each: true }) parentIds?: string[];
}