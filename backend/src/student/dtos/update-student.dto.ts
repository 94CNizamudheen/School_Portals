


import { IsString, IsNumber, IsArray, IsMongoId, IsOptional } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsNumber() age?: number;
  @IsOptional() @IsString() classLevel?: string;
  @IsOptional() @IsArray() @IsMongoId({ each: true }) parentIds?: string[];
}
