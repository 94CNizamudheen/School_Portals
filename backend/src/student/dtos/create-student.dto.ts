

import { IsString, IsArray, IsMongoId, IsOptional, IsDate } from 'class-validator';

export class CreateStudentDto {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() classLevel: string;
  @IsString()identity:string;
  @IsMongoId()admissionId:string
  @IsOptional() @IsArray() @IsMongoId({ each: true }) parentIds?: string[];
}
