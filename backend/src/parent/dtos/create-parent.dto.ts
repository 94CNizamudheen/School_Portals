import { IsArray, IsMongoId, IsOptional } from "class-validator";

export class CreateParentDto {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  studentIds?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  admissionIds?: string[];

  @IsOptional()
  relations?: { admissionId: string; relationship: string }[];

  @IsOptional() name?: string;
  @IsOptional() email?: string;
  @IsOptional() mobileNumber?: string;
  @IsOptional() occupation?: string;
  @IsOptional() emergencyContactName?: string;
  @IsOptional() emergencyContactPhone?: string;
}
