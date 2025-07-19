import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TeacherRepository } from '../repositories/teacher.repository';
import { CreateTeacherDto } from '../dtos/create-teacher.dto'; 
import { UpdateTeacherDto } from '../dtos/update-teacher.dto';
import { uploadImage } from 'src/shared/utils/upload.image';

@Injectable()
export class TeacherService {
  constructor(@Inject('ITeacherRepository') private readonly repo: TeacherRepository) {}

  async create(dto: CreateTeacherDto,file:Express.Multer.File) {

    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw new ForbiddenException('Teacher with this email already exists');

    const imageUrl= await uploadImage(file)

    const result = await this.repo.createTeacher({...dto, profileImage:imageUrl});
    return result;
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: string) {
    const teacher = await this.repo.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async update(id: string, dto: UpdateTeacherDto) {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing && (existing._id as string).toString()  !== id) {
      throw new ForbiddenException('Email already exists');
    }

    return this.repo.updateTeacher(id, dto);
  }

  async delete(id: string) {
    const teacher = await this.repo.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');

    await this.repo.deleteTeacher(id);
  }
}
