import { UpdateSubjectDto } from "src/subject/dtos/update.subject.dto";
import { SubjectTypes } from "./subject.types.interface";
import { CreateSubjectDto } from "src/subject/dtos/create.subject.dto";
import { Types } from "mongoose";



export interface ISubjectRepository {
    findAll(): Promise<SubjectTypes[]>;
    findById(id: string): Promise<SubjectTypes | null>;
    findByName(name: string): Promise<SubjectTypes | null>;
    updateSubject(id: string, data: UpdateSubjectDto): Promise<SubjectTypes | null>;
    createSubject(data: CreateSubjectDto): Promise<SubjectTypes>;
    addTeacher(id: string, teacherId: string): Promise<SubjectTypes|null>;
    removeTeacher(id: string, teacherId: string): Promise<SubjectTypes|null>;
    deleteSubject(id: string): Promise<SubjectTypes | null> 
};

