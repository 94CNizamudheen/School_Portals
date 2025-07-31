


import { IsString, IsNumber, IsArray, IsMongoId, IsOptional, IsBoolean } from 'class-validator';

export class UpdateStudentDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsNumber() age?: number;
  @IsOptional() @IsBoolean() isActive?:boolean;
  @IsOptional() @IsString() classLevel?: string;
  @IsOptional() @IsArray() @IsMongoId({ each: true }) parentIds?: string[];
}
