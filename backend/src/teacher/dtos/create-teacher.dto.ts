
import { IsString,IsEmail,IsDateString,IsArray,IsNumber, ArrayNotEmpty } from "class-validator";

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