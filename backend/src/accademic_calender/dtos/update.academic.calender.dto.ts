import { IsArray, IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { CalendarType } from "../types/CalenderType.enums";


export class UpdateAcademicCalendarDto {
    @IsOptional() @IsString() title?: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @IsDateString() date?: string;
    @IsOptional() @IsDateString() endDate?: string;
    @IsOptional() @IsEnum(CalendarType) type?: CalendarType;
    @IsOptional() @IsString() academicYear?: string;
    @IsOptional() @IsArray() @IsMongoId({ each: true }) applicableClassDivisions?: string[]
}
