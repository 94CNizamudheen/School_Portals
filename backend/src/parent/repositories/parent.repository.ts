import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { IParentRepository } from "./interfaces/parent.repository.interface";
import { Parent } from "../entities/parent.schema";
import { User } from "src/user/entities/user.schema";
import { Student } from "src/student/entities/student.schema"; 
import { Model, Types } from "mongoose";
import { CreateParentDto } from "../dtos/create-parent.dto";
import { UpdateParentDto } from "../dtos/update-parent.dto";
import { AdmissionType } from "src/admission/repositories/admission.type";
import { ParentMatchCriteria } from "./interfaces/parent.type.inerface";

@Injectable()
export class ParentRepository implements IParentRepository {
  constructor(
    @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Student.name) private readonly studentModel: Model<Student>
  ) {}

  async findByEmail(email: string) {
    return this.parentModel.findOne({ email }).exec();
  }

async createParent(dto: CreateParentDto, admission: AdmissionType) {
  const payload = {
    name: admission.parentName,
    email: admission.email,
    mobileNumber: admission.mobileNumber,
    occupation: admission.parentOccupation,
    relationship: admission.relationToStudent,
    admissionId: admission._id,
    studentIds: dto.studentIds?.map(id => new Types.ObjectId(id)) ?? []
  };

  const parent = new this.parentModel(payload);
  return await parent.save();
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

  // async removeParentFromAllStudents(parentId: string, studentIds: (string | Types.ObjectId)[]) {
  //   for (const studentId of studentIds) {
  //     const sid = studentId.toString();
  //     const student = await this.studentModel.findById(sid);
  //     if (student) {
  //       student.parentIds = student.parentIds.filter(id => id.toString() !== parentId);
  //       await student.save();
  //     }
  //   }
  // }

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
  async pushStudentIds(parentId: string, studentIds: string[]){
    const updated= await this.parentModel.findByIdAndUpdate(parentId,{$addToSet:{studentIds:{$each:studentIds.map(id=>new Types.ObjectId(id))}}},{new:true});
    if(!updated) throw new NotFoundException("Parent Not found with this id")
    return updated
  }
   async findByMultipleFields(criteria: ParentMatchCriteria): Promise<Parent | null> {
    return await this.parentModel.findOne(criteria);
  }
}
