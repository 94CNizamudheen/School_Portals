import { IsString } from "class-validator";


export class SendMailDto {
    @IsString() to: string
    @IsString() subject: string;
    @IsString() text?: string;
    @IsString() html?: string;
}

export class SendStudentLoginDetailsDto {
    @IsString() toEmail: string;
    @IsString() studentIdentity: string;
    @IsString() password: string;
}