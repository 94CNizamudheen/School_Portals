
import {Injectable,NotFoundException,ForbiddenException,InternalServerErrorException,Logger,} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin } from '../domain/admin.schema';
import { CreateAdminDto, UpdateAdminDto } from '../infrastrucure/admin.dto';
import { User } from 'src/auth/domain/user.schema';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService
  ) {}

  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    try {
      const ex_admin = await this.adminModel.findOne({ email: createAdminDto.email }).exec();
      if (ex_admin) throw new ForbiddenException('Admin with this email already exists');

      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const admin = new this.adminModel(createAdminDto);
      const savedAdmin = await admin.save();

      const user = new this.userModel({
        name: createAdminDto.name,
        password: hashedPassword,
        role: 'ADMIN',
        profileId: savedAdmin._id,
      });
      await user.save();

      console.log(`Admin created: ${savedAdmin.email}, Password: ${randomPassword}`);
      return savedAdmin;
    } catch (error) {
      console.error('Create Admin Error:', error);
      throw new InternalServerErrorException('Unable to create admin');
    }
  }

  async findAll(): Promise<Admin[]> {
    try {
      return await this.adminModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch admin list');
    }
  }

  async findOne(id: string): Promise<Admin> {
    try {
      const admin = await this.adminModel.findById(id).exec();
      if (!admin) throw new NotFoundException('Admin not found');
      return admin;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch admin');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const admin = await this.adminModel.findById(id).exec();
      if (!admin) throw new NotFoundException('Admin not found');

      await this.adminModel.deleteOne({ _id: id });
      await this.userModel.deleteOne({ profileId: id });
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete admin');
    }
  }

  async update(id: string, updateDto: UpdateAdminDto): Promise<Admin | null> {
    try {
      const admin = await this.adminModel.findById(id).exec();
      if (!admin) throw new NotFoundException('Admin not found');

      if (updateDto.email) {
        const exist = await this.adminModel.findOne({ email: updateDto.email }).exec();
        if (exist) throw new ForbiddenException('Email already exists');
      }

      const user = await this.userModel.findOne({ profileId: id }).exec();
      if (user && updateDto.email) {
        user.email = updateDto.email;
        await user.save();
      }

      return await this.adminModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
    } catch (error) {
      throw new InternalServerErrorException('Failed to update admin');
    }
  }

  async seedSuperAdmin(): Promise<void> {
    const logger = new Logger('AdminService');

    try {
      const email = this.configService.get<string>('SUPERADMIN_EMAIL');
      const password = this.configService.get<string>('SUPERADMIN_PASSWORD');
      const name = this.configService.get<string>('SUPERADMIN_NAME');
      const mobileNumber = this.configService.get<string>('SUPERADMIN_MOBILE');

      if (!email || !password || !name || !mobileNumber) {
        logger.error('Missing super admin environment variables');
        throw new Error('Missing super admin environment variables');
      }

      const ex_super = await this.adminModel.findOne({ email }).exec();
      if (ex_super) {
        logger.log('Super admin already exists');
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new this.adminModel({
        name,
        email,
        mobileNumber,
      });
      const savedAdmin = await admin.save();

      const user = new this.userModel({
        name,
        email,
        password: hashedPassword,
        role: 'ADMIN',
        profileId: savedAdmin._id,
      });

      await user.save();
      logger.log(`Super admin created. Email: ${email}, Password: ${password}`);
    } catch (error) {
      logger.error('Super admin creation failed:', error);
      throw new InternalServerErrorException('Failed to seed super admin');
    }
  }
}
