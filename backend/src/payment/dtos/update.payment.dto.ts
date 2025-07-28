import { Type } from '@nestjs/common';
import { IsEnum, IsMongoId, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsMongoId() paymentId: string;
  @IsMongoId() studentId:string;
  @IsMongoId() parentId:string;
  @IsEnum(['pending', 'success', 'failed', ]) status: 'pending' | 'completed' | 'failed' | 'success';
}
