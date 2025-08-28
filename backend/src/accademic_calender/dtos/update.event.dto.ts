import { IsDateString, IsOptional, IsString } from "class-validator";



export class UpdateSchoolEventDto{
   @IsOptional() @IsString() title:string;
   @IsOptional() @IsString() description:string;
   @IsOptional() @IsDateString() date:string;
   @IsOptional() @IsDateString() endDate:string;
   @IsOptional() @IsString() venue:string;
}