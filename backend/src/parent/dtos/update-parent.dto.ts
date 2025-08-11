

import { IsEmail, IsString, IsArray, IsMongoId, IsOptional } from "class-validator";

export class UpdateParentDto {
   @IsOptional() @IsArray() @IsMongoId({ each: true }) studentIds?: string[];
 
   @IsOptional()relations?: { admissionId: string; relationship: string }[];
 
   @IsOptional() name?: string;
   @IsOptional() email?: string;
   @IsOptional() mobileNumber?: string;
   @IsOptional() occupation?: string;
   @IsOptional() emergencyContactName?: string;
   @IsOptional() emergencyContactPhone?: string;
}
