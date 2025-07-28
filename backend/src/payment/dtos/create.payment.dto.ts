import { IsString, IsNumber } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  admissionId: string;

  @IsNumber()
  amount: number;

  @IsString()
  transactionId: string;
}
