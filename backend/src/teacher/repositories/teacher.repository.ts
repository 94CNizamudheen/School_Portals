


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher } from '../entities/teacher.schema'; 
import { User } from 'src/auth/entities/user.schema'; 
import { CreateTeacherDto } from '../dtos/create-teacher.dto'; 
import { UpdateTeacherDto } from '../dtos/update-teacher.dto';
import * as bcrypt from 'bcrypt';
import { ITeacherRepository } from './interfaces/teacher.repository.interface';

@Injectable()
export class TeacherRepository implements ITeacherRepository  {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async findByEmail(email: string) {
    return this.teacherModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    return this.teacherModel.findById(id).exec();
  }

  async findAll() {
    return this.teacherModel.find().exec();
  }

  async createTeacher(dto: CreateTeacherDto) {
    const password = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(password, 10);

    const teacher = new this.teacherModel(dto);
    const savedTeacher = await teacher.save();

    const user = new this.userModel({
      email: dto.email,
      password: hashed,
      role: 'TEACHER',
      profileId: savedTeacher._id,
    });

    await user.save();
    console.log(`Teacher created: ${dto.email}, Password: ${password}`);

    return savedTeacher;
  }

  async updateTeacher(id: string, dto: UpdateTeacherDto) {
    const teacher = await this.teacherModel.findByIdAndUpdate(id, dto, { new: true }).exec();

    if (dto.email) {
      const user = await this.userModel.findOne({ profileId: id });
      if (user) {
        user.email = dto.email;
        await user.save();
      }
    }

    return teacher;
  }

  async deleteTeacher(id: string) {
    await this.teacherModel.deleteOne({ _id: id });
    await this.userModel.deleteOne({ profileId: id });
  }
}
