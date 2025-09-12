import { IsArray, IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import  { CalendarType } from "../types/CalenderType.enums";
import { IsAfterDate } from "src/common/validators/day.validator";



export class CreateAcademicCalendarDto {
    @IsString() title: string;
    @IsOptional() @IsString() description?: string;
    @IsDateString() date: string;
    @IsDateString() @IsAfterDate('date',{message:'endDate must be after or equal to date'}) endDate: string;
    @IsOptional() @IsEnum(CalendarType) type: CalendarType;
    @IsOptional() @IsString() academicYear?: string;
    @IsArray() @IsMongoId({ each: true }) applicableClassDivisions: string[]
}