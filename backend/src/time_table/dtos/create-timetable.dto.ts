import { IsISO8601, IsNotEmpty, IsString } from "class-validator";


export class CreateTimetableSlotDto {
  @IsString() @IsNotEmpty() division: string;
  @IsISO8601() @IsNotEmpty() date: string; 
  @IsString() @IsNotEmpty() day: string;
  @IsString() @IsNotEmpty() startTime: string;
  @IsString() @IsNotEmpty() endTime: string;
  @IsString() @IsNotEmpty() subject: string;
  @IsString() @IsNotEmpty() subjectId: string;
  @IsString() @IsNotEmpty() teacher: string;
  @IsString() teacherName?: string;
  @IsString() color?: string;
  @IsString() grade?: string;
}