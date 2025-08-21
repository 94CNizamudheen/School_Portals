import { Injectable, Logger } from "@nestjs/common";
import { ISubjectRepository } from "./interfaces/subject.repository.interface";
import { SubjectTypes } from "./interfaces/subject.types.interface";
import { Model, Types } from "mongoose";
import { Subject } from "../entitie/subject.schema";
import { CreateSubjectDto } from "../dtos/create.subject.dto";
import { UpdateSubjectDto } from "../dtos/update.subject.dto";
import { InjectModel } from "@nestjs/mongoose";


@Injectable()
export class SubjectRepository implements ISubjectRepository{
    private readonly logger= new Logger(SubjectRepository.name)
    constructor(
       @InjectModel(Subject.name) private readonly subjectModel:Model<Subject>
    ){}
    async findAll(): Promise<SubjectTypes[]> {
        return await this.subjectModel.find().lean<SubjectTypes[]>() ;
    }
    async findById(id: string): Promise<SubjectTypes | null> {
        return await this.subjectModel.findById(id).lean<SubjectTypes|null>()
    }
    async findByName(name: string): Promise<SubjectTypes | null> {
        return await this.subjectModel.findOne({name}).collation({locale:"en",strength:2}).lean<SubjectTypes|null>()
    }
    async createSubject(data: CreateSubjectDto): Promise<SubjectTypes> {
        return (await this.subjectModel.create(data)).toObject() as SubjectTypes 
    }
    async updateSubject(id: string, data: UpdateSubjectDto): Promise<SubjectTypes | null> {
        return await this.subjectModel.findByIdAndUpdate(id,data,{new:true}).lean<SubjectTypes|null>()
    }
    async addTeacher(id: string, teacherId: string): Promise<SubjectTypes | null> {
        return await this.subjectModel.findByIdAndUpdate(id,{$addToSet:{assignedTeachers:teacherId}},{new:true}).lean<SubjectTypes|null>()
    }
    async removeTeacher(id: string, teacherId:string): Promise<SubjectTypes | null> {
        return await this.subjectModel.findByIdAndUpdate(id,{$pull:{assignedTeachers:teacherId}},{new:true}).lean<SubjectTypes|null>()
    }
    async deleteSubject(id: string):  Promise<SubjectTypes | null> {
       return await this.subjectModel.findByIdAndDelete(id)
    }

}
