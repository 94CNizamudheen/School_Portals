import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ISubjectRepository } from "../repositories/interfaces/subject.repository.interface";
import { SubjectTypes } from "../repositories/interfaces/subject.types.interface";
import { CreateSubjectDto } from "../dtos/create.subject.dto";
import { UpdateSubjectDto } from "../dtos/update.subject.dto";
import { Types } from "mongoose";
import { ITeacherRepository } from "src/teacher/repositories/interfaces/teacher.repository.interface";



@Injectable()
export class SubjectSerivice {
    private readonly logger= new Logger(SubjectSerivice.name)
    constructor(
        @Inject("ISubjectRepository") private readonly repo: ISubjectRepository,
        @Inject("ITeacherRepository") private readonly teacherRepo: ITeacherRepository,
    ) { }
    async findAllSubject(): Promise<SubjectTypes[]> {
        return await this.repo.findAll()
    };
    async findSubjectById(id: string): Promise<SubjectTypes | null> {
        const subject = await this.repo.findById(id);
        if (!subject) throw new NotFoundException("Subject not found");
        return subject
    };
    async findSubjectByName(name: string): Promise<SubjectTypes | null> {
        const subject = await this.repo.findByName(name);
        if (!subject) throw new NotFoundException("Subject not found");
        return subject
    };
    async createSubject(data: CreateSubjectDto): Promise<SubjectTypes> {
        const existing = await this.repo.findByName(data.name);
        if (existing ){
             throw new BadRequestException("Subject already exists");
        }
        const newSubject = await this.repo.createSubject(data);
        if (!newSubject) throw new ConflictException("cant create subject");
        return newSubject;
    };
    async updateSubject(id: string, data: UpdateSubjectDto): Promise<SubjectTypes | null> {
        const subject = await this.repo.findById(id);
        if (!subject) throw new NotFoundException("Subject not found");
        const updated = await this.repo.updateSubject(id, data);
        if (!updated) throw new ConflictException('Cant update subject due to conflict');
        return updated
    };
    async assignTeacher(id: string, teacherId: string): Promise<SubjectTypes | null> {
        const subject = await this.repo.findById(id);
        if (!subject) throw new NotFoundException("Subject not found");
        const teacher = await this.teacherRepo.findById(teacherId);
        if (!teacher) throw new NotFoundException("Teacher not found");
        const updated = await this.repo.addTeacher(id, teacherId);
        if (!updated) throw new ConflictException('Cant Assign due to conflict');
        return updated
    };
    async removeTeacher(id: string, teacherId: string): Promise<SubjectTypes | null> {
        const subject = await this.repo.findById(id);
        if (!subject) throw new NotFoundException("Subject not found");
        const teacher = await this.teacherRepo.findById(teacherId);
        if (!teacher) throw new NotFoundException("Teacher not found");
        const updated = this.repo.removeTeacher(id, teacherId);
        if (!updated) throw new ConflictException('Cant Remove due to conflict');
        return updated
    }
    async removeSubject(id: string):  Promise<SubjectTypes | null>  {
        const subject = await this.repo.findById(id);
        if (!subject) throw new NotFoundException("Subject not found");
        if (subject?.assignedTeachers && subject.assignedTeachers.length > 0) {
            throw new BadRequestException("Cant remove Subject subject have assigned teachers")
        }
        const deleted = await this.repo.deleteSubject(id);
        return deleted
    };

}