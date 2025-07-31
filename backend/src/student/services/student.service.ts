

import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { StudentRepository } from '../repositories/student.repository';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { IAdmissionRepository } from 'src/admission/repositories/interfaces/admission.repositoriy.interface';
@Injectable()
export class StudentService {
  private readonly logger= new Logger(StudentService.name)
  constructor( 
      @Inject("IStudentRepository") private readonly repo: StudentRepository,
       @Inject("IAdmissionRepository") private readonly admissionRepo:IAdmissionRepository,
    ) {}

  async create(dto: CreateStudentDto) {
     this.logger.log(`Creating student for admission ${dto.admissionId}`);
     const admission = await this.admissionRepo.findById(dto.admissionId);
     this.logger.log("Admission data",admission)
     if (!admission) throw new NotFoundException("Admission not found");
    return this.repo.createStudent(dto,admission.toObject());
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