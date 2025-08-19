import { Type } from "class-transformer";
import { IsString,IsEmail,IsDateString,IsArray,IsNumber, IsOptional, ValidateNested, } from "class-validator";
import { Address } from "src/common/utils/address";

export class UpdateTeacherDto{

    @IsOptional() @IsString() firstName:string;

    @IsOptional() @IsString() lastName:string;

    @IsOptional() @IsEmail() email:string;

    @IsOptional() @IsString() mobileNumber:string;

    @IsOptional() @IsDateString() dob:Date;

    @IsOptional() @IsString() university: string;

    @IsOptional() @IsString() degree:string;

    @IsOptional() @IsNumber() experienceYears:number;

    @IsOptional() @IsString() profileImage?: string;

    @IsOptional() @IsArray() @IsString({each:true}) subjects?:string[];

    @IsOptional() @ValidateNested() @Type(() => Address) address?: Address;
    
}

