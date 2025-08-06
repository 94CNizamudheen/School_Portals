

import { IsString, IsMongoId, } from 'class-validator';

export class CreateStudentDto {
  @IsString() identity: string;
  @IsString() password: string;
  @IsMongoId() admissionId: string;
}
