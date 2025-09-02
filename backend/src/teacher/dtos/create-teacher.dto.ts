
import { IsString, IsEmail, IsDateString, IsArray, IsNumber, ArrayNotEmpty, IsNotEmpty, IsMobilePhone, ValidateNested, IsOptional, IsIn } from "class-validator";

export class CreateTeacherDto {
    @IsString() @IsNotEmpty() firstName: string;
    @IsString() @IsNotEmpty() lastName: string;
    @IsEmail() email: string;
    @IsString() mobileNumber: string;
    @IsOptional() @IsString() profileImage?: string;
    @IsDateString() dob: Date;
    @IsString() @IsNotEmpty() addressLine: string;
    @IsString() @IsNotEmpty() city: string;
    @IsString() @IsNotEmpty() state: string;
    @IsString() @IsNotEmpty() pincode: string;
    @IsString() @IsNotEmpty() qualification: string;
    @IsString() @IsNotEmpty() university: string;
    @IsString() experience: string;
    @IsString() @IsNotEmpty() KTET_CTET_certificateNo: string;

    @IsString() subject: string;

    @IsArray() @IsString({ each: true }) @IsOptional() eligibilityDocuments?: string[];

    @IsOptional() @IsIn(['pending', 'approved', 'rejected']) status?: 'pending' | 'approved' | 'rejected';
}