// application/admin.service.ts
import {
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AdminRepository } from '../domain/admin.repository';
import { CreateAdminDto, UpdateAdminDto } from '../infrastructure/admin.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Admin } from '../domain/admin.schema';

@Injectable()
export class AdminService {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly configService: ConfigService
  ) {}

  async create(createDto: CreateAdminDto): Promise<Admin> {
    try {
      const existing = await this.adminRepository.findByEmail(createDto.email);
      if (existing) throw new ForbiddenException('Admin already exists');

      const password = Math.random().toString(36).slice(-8);
      const savedAdmin = await this.adminRepository.createAdmin(createDto);
      await this.adminRepository.createUserAccount(savedAdmin._id as string, createDto.name, createDto.email, password);

      console.log(`Admin created: ${createDto.email}, Password: ${password}`);
      return savedAdmin;
    } catch (error) {
      throw new InternalServerErrorException('Unable to create admin');
    }
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.findAll();
  }

  async findOne(id: string): Promise<Admin> {
    return this.adminRepository.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id); // throws if not found
    await this.adminRepository.deleteAdminAndUser(id);
  }

  async update(id: string, updateDto: UpdateAdminDto): Promise<Admin | null> {
    try {
      await this.findOne(id);

      if (updateDto.email) {
        const existing = await this.adminRepository.findByEmail(updateDto.email);
        if (existing) throw new ForbiddenException('Email already exists');
        await this.adminRepository.updateUserEmail(id, updateDto.email);
      }

      return this.adminRepository.updateAdmin(id, updateDto);
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
      const mobile = this.configService.get<string>('SUPERADMIN_MOBILE');

      if (!email || !password || !name || !mobile) {
        logger.error('Missing environment variables');
        throw new Error('Missing super admin env variables');
      }

      const exists = await this.adminRepository.findByEmail(email);
      if (exists) {
        logger.log('Super admin already exists');
        return;
      }

      const admin = await this.adminRepository.createAdmin({ name, email, mobileNumber: mobile });
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.adminRepository.createUserAccount(admin._id as string , name, email, hashedPassword);

      logger.log(`Super admin created: ${email}`);
    } catch (error) {
      logger.error('Error creating super admin', error);
      throw new InternalServerErrorException('Failed to seed super admin');
    }
  }
}
