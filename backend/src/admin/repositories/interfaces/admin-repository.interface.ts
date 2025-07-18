import { Admin } from '../../entities/admin.schema';
import { CreateAdminDto } from 'src/admin/dtos/create-admin.dto';
import { UpdateAdminDto } from 'src/admin/dtos/update-admin.dto';


export interface IAdminRepository {
  findByEmail(email: string): Promise<Admin | null>;
  createAdmin(createDto: CreateAdminDto): Promise<Admin>;
  createUserAccount(profileId: string, name: string, email: string, password: string): Promise<void>;
  findAll(): Promise<Admin[]>;
  findById(id: string): Promise<Admin>;
  deleteAdminAndUser(id: string): Promise<void>;
  updateAdmin(id: string, updateDto: UpdateAdminDto): Promise<Admin | null>;
  updateUserEmail(profileId: string, newEmail: string): Promise<void>;
}
