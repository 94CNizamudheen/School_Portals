import { User } from "src/auth/entities/user.schema";
import { Otp } from "src/auth/entities/otp.schema";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<User | null>;
  fetchUser(id:string):Promise<User|null>;
  createUser(data:Partial<User>): Promise<User>;
  comparePasswords(plain: string, hash: string): Promise<boolean>;
  createOtp(email: string): Promise<string>;
  findOtp(email: string, code: string): Promise<Otp | null>;
  deleteOtp(email: string): Promise<void>;
  updatePassword(email: string, newPassword: string): Promise<void>;
}
