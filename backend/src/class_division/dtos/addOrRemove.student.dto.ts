
import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class AddOrRemoveStudentDto {
  @IsMongoId() studentId: string;
  @IsOptional() @IsString() classLevel?: string
}
