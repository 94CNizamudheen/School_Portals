import { BadRequestException, ConflictException, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ClassDivisionType } from "../types/division.type.interface";
import { CreateClassDivisionDto } from "../dtos/create.division.dto";
import { UpdateClassDivisionDto } from "../dtos/update.division.dto";
import { AddOrRemoveStudentDto, } from "../dtos/addOrRemove.student.dto";
import { IStudentRepository } from "src/student/repositories/interfaces/student-repositories.interface";
import { IClassDivisionRepository } from "../repositories/interfaces/division.repository.interface";


@Injectable()
export class ClassDivisionService {
    private readonly logger = new Logger(ClassDivisionService.name)
    constructor(
        @Inject("IClassDivisionRepository") private readonly repo: IClassDivisionRepository,
        @Inject("IStudentRepository") private readonly studentRepo: IStudentRepository,
    ) { }

    async findAll(): Promise<ClassDivisionType[]> {
        return await this.repo.findAll();
    }
    async findById(id: string): Promise<ClassDivisionType> {
        const division = await this.repo.getById(id);
        if (!division) throw new NotFoundException('division not found');
        return division
    }
    async createDivision(data: CreateClassDivisionDto): Promise<ClassDivisionType> {
        
        return await this.repo.createDivision(data)
    }
    async updateDivision(id: string, data: UpdateClassDivisionDto): Promise<ClassDivisionType> {
        const division = await this.repo.getById(id);
        if (!division) throw new NotFoundException('Division Not fount');
        if(!data)  throw new BadRequestException("No data provided")
        const updated = await this.repo.update(id, data);
        if (!updated) throw new ConflictException('Update cannot be applied due to conflict');
        return updated
    }
    async deleteDivision(id: string): Promise<ClassDivisionType | null> {
        this.logger.debug("delete invoked")
        const division = await this.repo.getById(id);
        if (!division) throw new NotFoundException('division not found');

        if (division.assignedStudents.length > 0) throw new BadRequestException("Cant delete becouse of division has students")

        const deleted = await this.repo.delete(id)
        if (!deleted) throw new ConflictException('Delete cannot be applied due to conflict');
        return deleted
    }
    async addStudent(id: string, data: AddOrRemoveStudentDto): Promise<ClassDivisionType> {
        this.logger.debug(data)
        const division = await this.repo.getById(id);
        if (!division) throw new NotFoundException('division not found');
        const student = await this.studentRepo.findById(data.studentId)
        if (!student) throw new NotFoundException('Student Not found');
        if(student.division!=="") throw new BadRequestException('Student already in other division')
        if (division.classLevel !== data.classLevel) throw new BadRequestException("Student and Division class level not matching")
        const updated = await this.repo.assignStudents(id, data.studentId)
        if (!updated) throw new ConflictException(' cannot assign student due to conflict');
        student.division = division.divisionName
        await this.studentRepo.saveStudent(student)
        return updated
    }
    async removeStudent(id: string, data: AddOrRemoveStudentDto): Promise<ClassDivisionType> {
        const division = await this.repo.getById(id);
        if (!division) throw new NotFoundException('division not found');
        const student = await this.studentRepo.findById(data.studentId)
        if (!student) throw new NotFoundException('Student Not found');

        const updated = await this.repo.removeStudent(id, data.studentId)
        if (!updated) throw new ConflictException(' cannot remove student due to conflict');
        student.division = ''
        await this.studentRepo.saveStudent(student)
        return updated
    }

}