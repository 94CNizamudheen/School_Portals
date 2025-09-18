import { IsOptional, IsString } from "class-validator";


export class QueryTimetableDto{
    @IsString() division:string;
    @IsString() month:string;
    @IsOptional() @IsString() teacher?:string;
}