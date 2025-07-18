

import { Injectable, NotFoundException } from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';
@Injectable()
export class StudentService {
  constructor(private readonly repo: StudentRepository) {}

  async create(dto: CreateStudentDto) {
    return this.repo.createStudent(dto);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async findOne(id: string) {
    const student = await this.repo.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async update(id: string, dto: UpdateStudentDto) {
    const updated = await this.repo.updateStudent(id, dto);
    if (!updated) throw new NotFoundException('Student not found');
    return updated;
  }

  async delete(id: string) {
    const student = await this.repo.findById(id);
    if (!student) throw new NotFoundException('Student not found');
    await this.repo.deleteStudent(id);
  }
}