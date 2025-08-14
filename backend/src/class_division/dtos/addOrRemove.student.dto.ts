
import { IsMongoId } from 'class-validator';

export class AddOrRemoveStudentDto {
  @IsMongoId()
  studentId: string;
}
