import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '../entities/user.schema';
import { Otp, OtpDocument } from '../entities/otp.schema';
import { IAuthRepository } from './interfaces/auth-repository.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Otp.name) private readonly otpModel: Model<OtpDocument>,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
  async  fetchUser(id: string): Promise<User | null> {
      return this.userModel.findById(new Types.ObjectId(id)).lean();
  }

  async createUser(data:User): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password,10);
    const newUser = new this.userModel({ ...data, password: hashedPassword, profileId: data.profileId || uuidv4(), });
    return newUser.save();
  }

  async comparePasswords(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  async createOtp(email: string): Promise<string> {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await this.otpModel.deleteMany({ email }); // clean old OTPs
    const otpDoc = new this.otpModel({ email, code: otpCode, createdAt: new Date() });
    await otpDoc.save();
    return otpCode;
  }

  async findOtp(email: string, code: string): Promise<Otp | null> {
    const otp = await this.otpModel.findOne({ email, code }).exec();
    if (!otp) return null;

    const now = new Date();
    const expiryTime = 5 * 60 * 1000; // 5 minutes
    const isExpired = now.getTime() - new Date(otp.createdAt).getTime() > expiryTime;

    return isExpired ? null : otp;
  }

  async deleteOtp(email: string): Promise<void> {
    await this.otpModel.deleteMany({ email });
  }

  async updatePassword(email: string, newPassword: string): Promise<void> {
    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userModel.updateOne({ email }, { password: hashed });
  }
}
