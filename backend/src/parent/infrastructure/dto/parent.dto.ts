
import { IsEmail,IsString,IsArray,IsMongoId,IsOptional} from "class-validator";

export class CreateParentDto{
    @IsString()
    name:string;

    @IsEmail()
    email:string;

    @IsString()
    mobileNumber:string;

    @IsOptional() @IsString() 
    occupation?:string;

    @IsOptional() @IsArray() @IsMongoId({each:true})
    studentsIds?:string[]
};

export class UpdateParentDto{
    @IsOptional() @IsString()
    name:string;

    @IsOptional() @IsEmail()
    email:string;

    @IsOptional() @IsString()
    mobileNumber:string;

    @IsOptional() @IsString() 
    occupation?:string;

    @IsOptional() @IsArray() @IsMongoId({each:true})
    studentsIds?:string[]
}