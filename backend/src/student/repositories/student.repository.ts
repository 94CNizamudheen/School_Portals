

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student } from '../entities/student.schema'; 
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';

@Injectable()
export class StudentRepository {
  constructor(@InjectModel(Student.name) private studentModel: Model<Student>) {}

  async createStudent(dto: CreateStudentDto) {
    const payload = {
      ...dto,
      parentIds: dto.parentIds?.map(id => new Types.ObjectId(id)) || []
    };
    return new this.studentModel(payload).save();
  }

  async findAll() {
    return this.studentModel.find().lean();
  }

  async findById(id: string) {
    return this.studentModel.findById(id).lean();
  }

  async updateStudent(id: string, dto: UpdateStudentDto) {
    const payload = {
      ...dto,
      parentIds: dto.parentIds?.map(id => new Types.ObjectId(id))
    };
    return this.studentModel.findByIdAndUpdate(id, payload, { new: true }).lean();
  }

  async deleteStudent(id: string) {
    await this.studentModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}