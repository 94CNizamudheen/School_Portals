import { IsEnum, IsString } from "class-validator";


export class UpdatePaymentDto{
    @IsString()studentId:string;
    @IsEnum(['pending','completed'])status:'pending'|'completed';
}