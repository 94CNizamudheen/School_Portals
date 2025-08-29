

import { Otp } from '../../entities/otp.schema';

export interface IAuthRepository {
  comparePasswords(plain: string, hash: string): Promise<boolean>;
  createOtp(email: string): Promise<string>;
  findOtp(email: string, code: string): Promise<Otp | null>;
  deleteOtp(email: string): Promise<void>;
  updatePassword(email: string, newPassword: string): Promise<void>;
  createBlacklist(token: string, expiredAt: Date): Promise<void>;
  isBlacklisted(token:string):Promise<boolean>;
}
