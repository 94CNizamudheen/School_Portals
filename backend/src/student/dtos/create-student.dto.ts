

import { IsString, IsNumber, IsArray, IsMongoId, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsNumber() age: number;
  @IsString() classLevel: string;
  @IsOptional() @IsArray() @IsMongoId({ each: true }) parentIds?: string[];
}
