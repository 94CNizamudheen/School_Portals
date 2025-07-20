

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.schema';
import { Otp } from '../entities/otp.schema'; 
import { IAuthRepository } from './interfaces/auth-repository.interface';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(name:string ,email: string, password: string, role: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({name, email, password: hashedPassword, role });
    return user.save();
  }

  async comparePasswords(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  async createOtp(email: string): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

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
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne({ email }, { password: hashedPassword });
  }
  async findUserById(id:string):Promise<User|null>{
    return await this.userModel.findById(id);
  }
}