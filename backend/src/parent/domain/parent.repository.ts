
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Parent } from './parent.schema';
import { User } from 'src/auth/domain/user.schema';
import { Student } from 'src/student/domain/student.schema';
import * as bcrypt from 'bcrypt';
import { CreateParentDto, UpdateParentDto } from '../infrastructure/dto/parent.dto';

@Injectable()
export class ParentRepository {
  constructor(
    @InjectModel(Parent.name) private parentModel: Model<Parent>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Student.name) private studentModel: Model<Student>
  ) { }

  async findByEmail(email: string) {
    return this.parentModel.findOne({ email }).lean();
  }

  async createParent(dto: CreateParentDto) {
    const payload = {
      ...dto,
      studentIds: dto.studentIds?.map(id => new Types.ObjectId(id))
    };
    const parent = new this.parentModel(payload);
    const saved = await parent.save();
    return saved.toObject({ getters: true }); // exposes `.id` instead of `._id`
  }

  async createUser(email: string, password: string, parentId: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashed,
      role: 'PARENT',
      profileId: parentId
    });
    return user.save();
  }

  async findAllParents() {
    return this.parentModel.find().lean();
  }

  async findParentById(id: string) {
    return this.parentModel.findById(id).lean();
  }

  async updateParent(id: string, dto: UpdateParentDto) {
    const payload = { ...dto,
      studentIds: dto.studentIds?.map(id => new Types.ObjectId(id))
    };
    return this.parentModel.findByIdAndUpdate(id, payload, { new: true }).lean();
  }

  async updateUserEmail(profileId: string, newEmail: string) {
    const user = await this.userModel.findOne({ profileId });
    if (user) {
      user.email = newEmail;
      return user.save();
    }
  }

  async addParentToStudent(studentId: string, parentId: string) {
    const student = await this.studentModel.findById(studentId);
    if (!student) return null;

    const pId = new Types.ObjectId(parentId);
    student.parentIds = student.parentIds || [];
    if (!student.parentIds.some(id => id.equals(pId))) {
      student.parentIds.push(pId);
      await student.save();
    }
    return student.toObject({ getters: true });
  }

  async removeParentFromAllStudents(parentId: string, studentIds: (string | Types.ObjectId)[]) {
    for (const studentId of studentIds) {
      const sid = studentId.toString();
      const student = await this.studentModel.findById(sid);
      if (student) {
        student.parentIds = student.parentIds.filter(id => id.toString() !== parentId);
        await student.save();
      }
    }
  }


  async deleteParent(id: string) {
    await this.userModel.deleteOne({ profileId: id });
    return this.parentModel.deleteOne({ _id: id });
  }

  async findChildrens(ids:Types.ObjectId[]){
    const childrens= await this.studentModel.find({_id:{$in:ids}},'firstName lastName').lean()
    return  childrens
  }

}
