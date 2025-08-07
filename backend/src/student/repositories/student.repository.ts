

import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Student } from '../entities/student.schema';
import { CreateStudentDto } from '../dtos/create-student.dto';
import { UpdateStudentDto } from '../dtos/update-student.dto';
import { IStudentRepository } from './interfaces/student-repositories.interface';
import { AdmissionType } from 'src/admission/repositories/admission.type';
import * as bcrypt from 'bcrypt';
@Injectable()

export class StudentRepository implements IStudentRepository {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  async createStudent(dto: CreateStudentDto,admission:AdmissionType): Promise<Student> {
   
    const student = new this.studentModel({
      firstName: admission.firstName,
      lastName: admission.lastName,
      classLevel: admission.classApplied,
      admissionId: dto.admissionId,
      identity: dto.identity,
      password: dto.password,
      religion:admission.religion,
      cast:admission.cast,
      rollNumber: admission.rollNumber || undefined,
      class: admission.classApplied || undefined,
      dob: admission.dob,
      gender: admission.gender,
      bloodGroup: admission.bloodGroup,
      nationality: admission.nationality,
      address: admission.address,
      state: admission.state,
      pincode: admission.pincode,
      mobileNumber: admission.mobileNumber,
      email: admission.email,
      previousSchool: admission.previousSchool,
      medicalInformation: admission.medicalInformation,
      profilePicture: admission.profilePicture || undefined,
      isActive: true
    });

    return student.save();
  }

  async findAll() {
    return this.studentModel.find().lean();
  }

  async findById(id: string) {
    return this.studentModel.findById(id).lean();
  }
  async findByIdentity(identity: string): Promise<Student | null> {
      return await this.studentModel.findOne({identity})
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
  async saveStudent(student: Student) {
    return await student.save()
  }
  async updatePassword(identity: string, password: string): Promise<void> {
      const hashedPassword= await bcrypt.hash(password,10)
      await this.studentModel.updateOne({identity},{password:hashedPassword})
  }
}