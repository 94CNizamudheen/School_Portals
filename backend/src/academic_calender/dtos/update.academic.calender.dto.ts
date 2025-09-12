import { IsArray, IsDateString, IsEnum, IsMongoId, IsOptional, IsString } from "class-validator";
import { CalendarType } from "../types/CalenderType.enums";
import { IsAfterDate } from "src/common/validators/day.validator";


export class UpdateAcademicCalendarDto {
    @IsOptional() @IsString() title?: string;
    @IsOptional() @IsString() description?: string;
    @IsOptional() @IsDateString() date?: string;
    @IsOptional() @IsDateString() @IsAfterDate('date',{message:'endDate must be after or equal to date'}) endDate: string;;
    @IsOptional() @IsEnum(CalendarType) type?: CalendarType;
    @IsOptional() @IsString() academicYear?: string;
    @IsOptional() @IsArray() @IsMongoId({ each: true }) applicableClassDivisions?: string[]
}
