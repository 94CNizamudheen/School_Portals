import { IsDateString, IsOptional, IsString } from "class-validator";



export class UpdateSchoolEvent{
   @IsOptional() @IsString() title:string;
   @IsOptional() @IsString() description:string;
   @IsOptional() @IsDateString() date:string;
   @IsOptional() @IsDateString() endDate:string;
   @IsOptional() @IsString() venue:string;
   @IsOptional() @IsString() posterUrl:string;
}