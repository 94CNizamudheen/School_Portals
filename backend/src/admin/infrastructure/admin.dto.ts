
import { IsString,IsEmail ,IsOptional,} from "class-validator";

export class CreateAdminDto{
    @IsString()
    name:string;

    @IsEmail()
    email:string;

    @IsString()
    mobileNumber:string;

};
export class UpdateAdminDto{
    @IsOptional() @IsString()
    name:string;

    @IsOptional() @IsEmail() 
    email:string;

    @IsOptional() @IsString()
    mobileNumber:string;

}
 