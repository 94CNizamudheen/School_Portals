

import { IsEmail, IsString, IsArray, IsMongoId, IsOptional } from "class-validator";

export class UpdateParentDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() mobileNumber?: string;

  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() relationship?: string;

  @IsOptional() @IsString() emergencyContactName?: string;
  @IsOptional() @IsString() emergencyContactPhone?: string;
  @IsOptional() @IsString() emergencyContactRelationship?: string;

  @IsOptional() @IsArray() @IsMongoId({ each: true }) studentIds?: string[];
}
