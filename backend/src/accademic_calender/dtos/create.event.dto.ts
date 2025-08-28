import { IsDateString, IsString } from "class-validator";


export class CreateSchoolEvent{
    @IsString() title:string;
    @IsString() description:string;
    @IsDateString() date:string;
    @IsDateString() endDate:string;
    @IsString() venue:string;
    @IsString() posterUrl:string;
}