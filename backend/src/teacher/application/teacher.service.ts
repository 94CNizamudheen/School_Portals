import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TeacherRepository } from '../domain/teacher.repository';
import { CreateTeacherDto,UpdateTeacherDto } from '../infrastruture/dto/teacher.dto'; 

@Injectable()
export class TeacherService {
  constructor(private readonly repo: TeacherRepository) {}

  async create(dto: CreateTeacherDto) {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw new ForbiddenException('Teacher with this email already exists');

    const result = await this.repo.createTeacher(dto);
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
