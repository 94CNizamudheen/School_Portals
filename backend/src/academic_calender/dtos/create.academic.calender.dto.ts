import { IsArray, IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import  { CalendarType } from "../types/CalenderType.enums";



export class CreateAcademicCalendarDto {
    @IsString() title: string;
    @IsOptional() @IsString() description?: string;
    @IsDateString() date: string;
    @IsDateString() endDate: string;
    @IsOptional() @IsEnum(CalendarType) type: CalendarType;
    @IsOptional() @IsString() academicYear?: string;
    @IsArray() @IsMongoId({ each: true }) applicableClassDivisions: string[]
}