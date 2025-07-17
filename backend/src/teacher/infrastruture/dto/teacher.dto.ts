
import { IsString,IsEmail,IsDateString,IsArray,IsNumber, IsOptional, isString, ArrayNotEmpty } from "class-validator";

export class CreateTeacherDto{

    @IsString() firstName:string;

    @IsString() lastName:string;

    @IsEmail() email:string;

    @IsString() mobileNumber:string;

    @IsDateString() dob:Date;

    @IsString() address:string;

    @IsString() degree:string;

    @IsString() university: string;

    @IsNumber() experienceYears:number;

    @IsString() profileImage: string;

    @IsArray() @ArrayNotEmpty() @IsString({each:true}) subjects?:string[];
}
export class UpdateTeacherDto{

    @IsOptional() @IsString() firstName:string;

    @IsOptional() @IsString() lastName:string;

    @IsOptional() @IsEmail() email:string;

    @IsOptional() @IsString() mobileNumber:string;

    @IsOptional()  @IsString() address:string;

    @IsOptional() @IsDateString() dob:Date;

    @IsOptional() @IsString() university: string;

    @IsOptional() @IsString() degree:string;

    @IsOptional() @IsNumber() experienceYears:number;

    @IsOptional() @IsString() profileImage?: string;

    @IsOptional() @IsArray() @IsString({each:true}) subjects?:string[];
}

