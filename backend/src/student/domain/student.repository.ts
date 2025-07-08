
// student.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './student.schema';
import { Parent } from 'src/parent/domain/parent.schema';
import { User } from 'src/auth/domain/user.schema';
import { Otp } from 'src/auth/domain/otp.schema';
import { Model, Types } from 'mongoose';
import { CreateParentDto } from 'src/parent/infrastructure/dto/parent.dto';

@Injectable()
export class StudentRepository {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(Parent.name) private parentModel: Model<Parent>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Otp.name) private otpModel: Model<Otp>
  ) {}

  createOtp(email: string, password: string, expireAt: Date) {
    const otp = new this.otpModel({ email, password, expireAt });
    return otp.save();
  }

  findStudentByEmailOrPhone(email: string, mobile: string) {
    return this.studentModel.findOne({ $or: [{ email }, { mobileNumber: mobile }] });
  }

  findParentByEmailOrPhone(email: string, mobile: string) {
    return this.parentModel.findOne({ $or: [{ email }, { mobileNumber: mobile }] });
  }

  createStudent(studentData: Partial<Student>) {
    const student = new this.studentModel(studentData);
    return student.save();
  }

async createOrUpdateParent(parentData: CreateParentDto,studentId: string,existingParent?: Parent | null): Promise<Parent> {
  const mappedStudentId = new Types.ObjectId(studentId);

  const mappedData = {...parentData, studentIds: parentData.studentIds?.map(id => new Types.ObjectId(id)),};

  let parent = existingParent;

  if (!parent) {
    parent = new this.parentModel({
      ...mappedData,
      studentIds: [mappedStudentId],
    });
  } else {
    parent.studentIds = [...(parent.studentIds || []), mappedStudentId];
  }

  await parent.save();
  return parent;
}


  createUsers(users: Partial<User>[]) {
    return this.userModel.insertMany(users);
  }

  findAllStudents() {
    return this.studentModel.find().populate('parentIds').exec();
  }

  findStudentById(id: string) {
    return this.studentModel.findById(id).exec();
  }

  updateStudent(id: string, update: Partial<Student>) {
    return this.studentModel.findByIdAndUpdate(id, update, { new: true }).populate('parentIds').exec();
  }

  deleteStudent(id: string) {
    return this.studentModel.deleteOne({ _id: id });
  }

  findParentById(id: string) {
    return this.parentModel.findById(id).exec();
  }

  updateUserEmail(profileId: string, email: string) {
    return this.userModel.findOneAndUpdate({ profileId }, { email });
  }

  deleteUserByProfileId(profileId: string) {
    return this.userModel.deleteOne({ profileId });
  }

  async removeStudentFromParents(studentId: string, parentIds: Types.ObjectId[]) {
    for (const parentId of parentIds) {
      const parent = await this.parentModel.findById(parentId).exec();
      if (parent) {
        parent.studentIds = parent.studentIds.filter(id => id.toString() !== studentId);
        await parent.save();
      }
    }
  }
}
