
import { Injectable, ForbiddenException, InternalServerErrorException, Logger } from '@nestjs/common';
import { AdminRepository } from '../repositories/admin.repository';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { UpdateAdminDto } from '../dtos/update-admin.dto';
import { ConfigService } from '@nestjs/config';
import { Admin } from '../entities/admin.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly configService: ConfigService,
  ) {}

  async create(createDto: CreateAdminDto): Promise<Admin> {
    const existing = await this.adminRepository.findByEmail(createDto.email);
    if (existing) throw new ForbiddenException('Admin already exists');

    const password = Math.random().toString(36).slice(-8);
    const savedAdmin = await this.adminRepository.createAdmin(createDto);
    await this.adminRepository.createUserAccount((savedAdmin._id as string) .toString(), createDto.name, createDto.email, password);

    this.logger.log(`Admin created: ${createDto.email}, Password: ${password}`);
    return savedAdmin;
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.findAll();
  }

  async findOne(id: string): Promise<Admin> {
    return this.adminRepository.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.adminRepository.deleteAdminAndUser(id);
  }

  async update(id: string, updateDto: UpdateAdminDto): Promise<Admin | null> {
    if (updateDto.email) {
      const existing = await this.adminRepository.findByEmail(updateDto.email);
      if (existing) throw new ForbiddenException('Email already exists');
      await this.adminRepository.updateUserEmail(id, updateDto.email);
    }

    return this.adminRepository.updateAdmin(id, updateDto);
  }

  async seedSuperAdmin(): Promise<void> {
    const { SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD, SUPERADMIN_NAME, SUPERADMIN_MOBILE } = this.configService.get<string>('') as any;

    if (!SUPERADMIN_EMAIL || !SUPERADMIN_PASSWORD || !SUPERADMIN_NAME || !SUPERADMIN_MOBILE) {
      this.logger.error('Missing environment variables');
      throw new Error('Missing super admin env variables');
    }

    const exists = await this.adminRepository.findByEmail(SUPERADMIN_EMAIL);
    if (exists) return this.logger.log('Super admin already exists');

    const admin = await this.adminRepository.createAdmin({
      name: SUPERADMIN_NAME,
      email: SUPERADMIN_EMAIL,
      mobileNumber: SUPERADMIN_MOBILE,
    });

    const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);
    await this.adminRepository.createUserAccount((admin._id as string).toString(), SUPERADMIN_NAME, SUPERADMIN_EMAIL, hashedPassword);

    this.logger.log(`Super admin created: ${SUPERADMIN_EMAIL}`);
  }
}
