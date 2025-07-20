

import { User } from '../../entities/user.schema';
import { Otp } from '../../entities/otp.schema';

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  createUser(name:string,email: string, password: string, role: string): Promise<User>;
  comparePasswords(plain: string, hash: string): Promise<boolean>;
  createOtp(email: string): Promise<string>;
  findOtp(email: string, code: string): Promise<Otp | null>;
  deleteOtp(email: string): Promise<void>;
  updatePassword(email: string, newPassword: string): Promise<void>;
  findUserById(id:string) :Promise<User|null>;
}
