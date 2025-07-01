
import { IsString,IsEmail,IsDateString,IsArray,IsNumber, IsOptional } from "class-validator";

export class CreateTeacherDto{
    @IsString() name:string;

    @IsEmail() email:string;

    @IsString() mobileNumber:string;

    @IsOptional() @IsDateString() dob:Date;

    @IsOptional() @IsString() qualification:string;

    @IsOptional() @IsNumber() experienceYear:number;

    @IsOptional() @IsArray() @IsString({each:true}) subjects?:string[];
}
export class UpdateTeacherDto{
    @IsOptional() @IsString() name:string;

    @IsOptional() @IsEmail() email:string;

    @IsOptional() @IsString() mobileNumber:string;

    @IsOptional() @IsDateString() dob:Date;

    @IsOptional() @IsString() qualification:string;

    @IsOptional() @IsNumber() experienceYear:number;

    @IsOptional() @IsArray() @IsString({each:true}) subjects?:string[];
}

