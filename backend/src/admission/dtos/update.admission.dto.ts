import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateAdmissionDto{

    @IsEnum(['approved','rejected'])status:'approved'|'rejected';
     @IsOptional() @IsString() verificationNotes?: string;
    @IsOptional() @IsString() rejectionReason?: string;
}