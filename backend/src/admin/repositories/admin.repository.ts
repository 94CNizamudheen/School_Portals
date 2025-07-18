import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../entities/admin.schema';
import { User } from 'src/auth/entities/user.schema';
import * as bcrypt from 'bcrypt';
import { CreateAdminDto,  } from '../dtos/create-admin.dto';
import { UpdateAdminDto } from '../dtos/update-admin.dto';
import { IAdminRepository } from './interfaces/admin-repository.interface';

@Injectable()
export class AdminRepository implements IAdminRepository {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminModel.findOne({ email }).exec();
  }

  async createAdmin(createDto: CreateAdminDto): Promise<Admin> {
    return new this.adminModel(createDto).save();
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
    const admin = await this.adminModel.findById(id);
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async deleteAdminAndUser(id: string): Promise<void> {
    await this.adminModel.deleteOne({ _id: id });
    await this.userModel.deleteOne({ profileId: id });
  }

  async updateAdmin(id: string, updateDto: UpdateAdminDto): Promise<Admin | null> {
    return this.adminModel.findByIdAndUpdate(id, updateDto, { new: true });
  }

  async updateUserEmail(profileId: string, newEmail: string): Promise<void> {
    const user = await this.userModel.findOne({ profileId });
    if (user) {
      user.email = newEmail;
      await user.save();
    }
  }
}
