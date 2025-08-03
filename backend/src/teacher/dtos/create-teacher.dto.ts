
import { Type } from "class-transformer";
import { IsString, IsEmail, IsDateString, IsArray, IsNumber, ArrayNotEmpty, IsNotEmpty, IsMobilePhone, ValidateNested, IsOptional, IsIn } from "class-validator";
import { AddressDto } from "src/utils/AddressDto";

export class CreateTeacherDto {
    @IsString()@IsNotEmpty()firstName: string;

    @IsString()@IsNotEmpty()lastName: string;

    @IsEmail()email: string;

    @IsString()mobileNumber: string;


    @IsOptional() @IsString()  profileImage?: string;

    @IsDateString() dob: Date;

    @ValidateNested()@Type(() => AddressDto)address: AddressDto;

    @IsString()@IsNotEmpty()qualification: string;

    @IsString()@IsNotEmpty()university: string;

    @IsString()experience: string;

    @IsString()@IsNotEmpty()KTET_CTET_certificateNo: string;

    @IsString()subject: string;

    @IsArray()@IsString({ each: true })@IsOptional()eligibilityDocuments?: string[];

    @IsOptional()@IsIn(['pending', 'approved', 'rejected'])status?: 'pending'| 'approved'| 'rejected';
}