
import { IsArray, IsMongoId, IsOptional } from "class-validator";

export class CreateParentDto {
  @IsOptional() @IsArray() @IsMongoId({ each: true }) studentIds?: string[];
  @IsMongoId() admissionId: string

  @IsOptional() name?: string;
  @IsOptional() mobileNumber?: string;
  @IsOptional() relationship?: string;
  @IsOptional() emergencyContactName?: string;
  @IsOptional() emergencyContactPhone?: string;
}
