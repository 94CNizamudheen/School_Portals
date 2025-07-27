import { IsString } from "class-validator";

export class CreatePaymentDto{
    @IsString()studentId:string
    @IsString()amount:string
    @IsString()transactionId:string
}