

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.schema';
import { Otp } from '../entities/otp.schema';
import { IAuthRepository } from './interfaces/auth-repository.interface';
import { BlacklistedToken } from '../entities/blacklist.schema';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectModel(BlacklistedToken.name)
    private readonly blacklistedModel: Model<BlacklistedToken>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>
  ) { }


  async comparePasswords(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  async createOtp(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.otpModel.create({ email, code, expireAt });
    return code;
  }

  async findOtp(email: string, code: string): Promise<Otp | null> {
    return this.otpModel.findOne({ email, code }).exec();
  }

  async deleteOtp(email: string): Promise<void> {
    await this.otpModel.deleteOne({ email });
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    if (!newPassword) throw new Error("New password is required");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne({ email }, { password: hashedPassword });
  }

  async createBlacklist(token: string, expiresAt: Date): Promise<void> {
    await this.blacklistedModel.create({ token, expiresAt })
  }
}