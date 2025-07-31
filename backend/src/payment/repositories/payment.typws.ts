

import { Types } from 'mongoose';

export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface PaymentType {
  _id?: Types.ObjectId;
  admissionId: string;
  parentId?: string;
  studentId?: string;
  amount: number;
  transactionId: string;
  status: PaymentStatus;

  createdAt?: Date;
  updatedAt?: Date;
}
