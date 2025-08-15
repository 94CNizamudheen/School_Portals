import { Injectable } from "@nestjs/common";
import { IClassDivisionRepository } from "./interfaces/division.repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { ClassDivision } from "../entitie/classDivision.schema";
import { Model, Types } from "mongoose";
import { ClassDivisionType } from "./interfaces/division.type.interface";
import { CreateClassDivisionDto } from "../dtos/create.division.dto";
import { UpdateClassDivisionDto } from "../dtos/update.division.dto";
import { AddOrRemoveStudentDto, } from "../dtos/addOrRemove.student.dto";


@Injectable()
export class ClassDivisionRepository implements IClassDivisionRepository{
    constructor(
        @InjectModel(ClassDivision.name) private  classDivisionModel:Model<ClassDivision>
    ) {}
    async findAll(): Promise<ClassDivisionType[]> {
        return await this.classDivisionModel.find()
       
    }
    async createDivision(data:CreateClassDivisionDto): Promise<ClassDivisionType> {
        return await this.classDivisionModel.create(data) as unknown as ClassDivisionType ;
    }
    async getById(id: string): Promise<ClassDivisionType | null> {
        return await this.classDivisionModel.findById(id)
    }
    async update(id: string, data: UpdateClassDivisionDto): Promise<ClassDivisionType | null> {
        return await this.classDivisionModel.findByIdAndUpdate(id,data,{new:true}).exec() as unknown as ClassDivisionType
    }
    async assignStudents(id: string, studentId: AddOrRemoveStudentDto): Promise<ClassDivisionType> {
       return await this.classDivisionModel.findByIdAndUpdate(id,{$addToSet:{assignedStudents:studentId}},{new:true}).exec() as unknown as ClassDivisionType
    }
    async removeStudent(id: string, studentid:AddOrRemoveStudentDto): Promise<ClassDivisionType> {
       return await this.classDivisionModel.findByIdAndUpdate(id,{$pull:{assignedStudents:studentid}},{new:true}).exec() as unknown as ClassDivisionType
    }
    async delete(id: string): Promise<ClassDivisionType | null> {
        return this.classDivisionModel.findByIdAndDelete(id).exec() as unknown as ClassDivisionType
    }
}