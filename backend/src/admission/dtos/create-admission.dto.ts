import { IsString, IsNotEmpty, IsOptional, IsEmail, IsDateString } from 'class-validator';

export class CreateAdmissionDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsDateString() dob: Date;
  @IsString() @IsNotEmpty() address: string;
  @IsString() @IsNotEmpty() state: string;
  @IsString() @IsNotEmpty() nationality: string;
  @IsString() @IsNotEmpty() pincode: string;
  @IsString() @IsNotEmpty() profilePicture: string;
  @IsString() @IsNotEmpty() bloodGroup: string;
  @IsString() @IsNotEmpty() aadharDocument: string;
  @IsString() @IsNotEmpty() birthCertificate: string;
  @IsOptional() previousSchool?: string;
  @IsOptional() transferCertificate?: string;
  @IsOptional() medicalInformation?: string;
  @IsString() @IsNotEmpty() parentName: string;
  @IsString() @IsNotEmpty() relationToStudent: string;
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() mobileNumber: string;
  @IsString() @IsNotEmpty() emergencyContactName: string;
  @IsString() @IsNotEmpty() emergencyContactNumber: string;
  @IsOptional() @IsString() parentOccupation?: string;
  @IsString() @IsNotEmpty() classApplied: string;
  @IsString() @IsNotEmpty() religion: string;
  @IsString() @IsNotEmpty() cast: string;
  @IsString() @IsNotEmpty() gender: string;
  @IsString() @IsOptional() status?: string;
}