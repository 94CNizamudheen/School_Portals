

import { IsString, IsArray, IsMongoId, } from 'class-validator';

export class CreateStudentDto {
  @IsString() firstName: string;
  @IsString() lastName: string;
  @IsString() classLevel: string;
  @IsString() identity: string;
  @IsString() password: string;
  @IsMongoId() admissionId: string
  @IsArray() @IsMongoId({ each: true }) parentIds?: string[];
}
