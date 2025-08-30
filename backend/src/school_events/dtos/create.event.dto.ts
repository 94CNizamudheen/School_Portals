import { IsDateString, IsOptional, IsString } from "class-validator";


export class CreateSchoolEventDto{
    @IsString() title:string;
    @IsString() description:string;
    @IsDateString() date:string;
    @IsDateString() endDate:string;
    @IsString() venue:string;
    @IsOptional() @IsString() posterUrl?:string
}