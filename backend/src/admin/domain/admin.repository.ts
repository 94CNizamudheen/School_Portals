


import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from './admin.schema';
import { CreateAdminDto, UpdateAdminDto } from '../infrastructure/admin.dto';
import { User } from 'src/auth/domain/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminRepository {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ email }).exec();
  }

  async createAdmin(createDto: CreateAdminDto): Promise<Admin> {
    const admin = new this.adminModel(createDto);
    return admin.save();
  }

  async createUserAccount(profileId: string, name: string, email: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ name, email, password: hashedPassword, role: 'ADMIN', profileId });
    await user.save();
  }

  async findAll(): Promise<Admin[]> {
    return this.adminModel.find().exec();
  }

  async findById(id: string): Promise<Admin> {
    const admin = await this.adminModel.findById(id).exec();
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async deleteAdminAndUser(id: string): Promise<void> {
    await this.adminModel.deleteOne({ _id: id });
    await this.userModel.deleteOne({ profileId: id });
  }

  async updateAdmin(id: string, updateDto: UpdateAdminDto): Promise<Admin | null> {
    return this.adminModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  }

  async updateUserEmail(profileId: string, newEmail: string): Promise<void> {
    const user = await this.userModel.findOne({ profileId }).exec();
    if (user) {
      user.email = newEmail;
      await user.save();
    }
  }
}
