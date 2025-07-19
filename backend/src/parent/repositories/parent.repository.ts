import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IParentRepository } from "./interfaces/parent.repository.interface";
import { Parent } from "../entities/parent.schema";
import { User } from "src/auth/entities/user.schema";
import { Student } from "src/student/entities/student.schema"; 
import { Model, Types } from "mongoose";
import { CreateParentDto } from "../dtos/create-parent.dto";
import { UpdateParentDto } from "../dtos/update-parent.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class ParentRepository implements IParentRepository {
  constructor(
    @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>
  ) {}

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
    return saved.toObject({ getters: true }); 
  }

  async createUser(email: string, password: string, parentId: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashed,
      role: 'PARENT',
      profileId: new Types.ObjectId(parentId) 
    });
    return user.save();
  }

  async findAllParents() {
    return this.parentModel.find().lean();
  }

  async findParentById(id: string) {
    return this.parentModel.findById(new Types.ObjectId(id)).lean();
  }

  async updateParent(id: string, dto: UpdateParentDto) {
    const payload = {
      ...dto,
      studentIds: dto.studentIds?.map(id => new Types.ObjectId(id))
    };
    return this.parentModel.findByIdAndUpdate(id, payload, { new: true }).lean();
  }

  async updateUserEmail(profileId: string, newEmail: string) {
    const user = await this.userModel.findOne({ profileId: new Types.ObjectId(profileId) });
    if (user) {
      user.email = newEmail;
      return user.save();
    }
    return null;
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
    await this.userModel.deleteOne({ profileId: new Types.ObjectId(id) });
    return this.parentModel.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async findChildrens(ids: Types.ObjectId[]) {
    return this.studentModel.find(
      { _id: { $in: ids } },
      'firstName lastName' 
    ).lean();
  }
}
