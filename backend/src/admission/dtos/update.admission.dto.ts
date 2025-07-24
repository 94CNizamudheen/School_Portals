import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateAdmissionDto{

    @IsEnum(['approved','rejected','completed'])status:'approved'|'rejected'|'completed';
     @IsOptional() @IsString() verificationNotes?: string;
    @IsOptional() @IsString() rejectionReason?: string;
}