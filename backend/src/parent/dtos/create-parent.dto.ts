
import { IsEmail, IsString, IsArray, IsMongoId, IsOptional } from "class-validator";

export class CreateParentDto {
  @IsString() name: string;
  @IsEmail() email: string;
  @IsString() mobileNumber: string;

  @IsOptional() @IsString() occupation?: string;
  @IsOptional() @IsString() relationship?: string;

  @IsOptional() @IsString() emergencyContactName?: string;
  @IsOptional() @IsString() emergencyContactPhone?: string;
  @IsOptional() @IsString() emergencyContactRelationship?: string;

  @IsOptional() @IsArray() @IsMongoId({ each: true }) studentIds?: string[];
}
