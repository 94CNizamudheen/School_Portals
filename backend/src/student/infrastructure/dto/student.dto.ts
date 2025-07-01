
import { IsEmail,IsEnum,IsString,IsOptional,IsDateString,IsArray,IsMongoId } from "class-validator";

export class CreateStudentDto{
    @IsString() name:string;

    @IsEmail() email:string;

    @IsString() mobileNumber:string;

    @IsOptional() @IsString() parantName?:string;

    @IsOptional() @IsString() address?:string;

    @IsOptional() @IsDateString() dob?:Date

    @IsOptional() @IsString() bloodGroup?:string;

    @IsOptional() @IsString() grade?:string;

    @IsOptional() @IsDateString() enrollmentDate?:string;

    @IsOptional() @IsString() @IsArray() parentIds?:string[];
};

export class UpdateStudentDto{

    @IsOptional() @IsString() name:string;

    @IsOptional() @IsEmail() email:string;

    @IsOptional() @IsString() mobileNumber:string;

    @IsOptional() @IsString() parantName?:string;

    @IsOptional() @IsString() address?:string;

    @IsOptional() @IsDateString() dob?:Date

    @IsOptional() @IsString() bloodGroup?:string;

    @IsOptional() @IsString() grade?:string;

    @IsOptional() @IsDateString() enrollmentDate?:string;

    @IsOptional() @IsString() @IsArray({each:true}) parentIds?:string[];
}