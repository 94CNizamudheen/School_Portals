import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ClassDivisionRepository } from "../repositories/division.repository";
import { ClassDivisionType } from "../repositories/interfaces/division.type.interface";
import { CreateClassDivisionDto } from "../dtos/create.division.dto";
import { UpdateClassDivisionDto } from "../dtos/update.division.dto";
import { AddOrRemoveStudentDto, } from "../dtos/addOrRemove.student.dto";


@Injectable()
export class ClassDivisionService {
    constructor(
        @Inject("IClassDivisionRepository") private readonly repo: ClassDivisionRepository,
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
        if (!division) throw new NotFoundException('Division Not fount')
        const updated = await this.repo.update(id, data);
        if (!updated) throw new ConflictException('Update cannot be applied due to conflict');
        return updated
    }
    async deleteDivision(id: string): Promise<ClassDivisionType | null> {
        const division = await this.repo.getById(id);
        if (!division) throw new NotFoundException('division not found');

        if (division.assignedStudents.length > 0) throw new BadRequestException("Cant delete becouse of division has students")

        const deleted = await this.repo.delete(id)
        if (deleted) throw new ConflictException('Delete cannot be applied due to conflict');
        return deleted
    }
    async addStudent(id: string, studentId: AddOrRemoveStudentDto): Promise<ClassDivisionType> {
        const division = await this.repo.getById(id);
        if (!division) throw new NotFoundException('division not found');
        const updated= await this.repo.assignStudents(id,studentId)
        if(!updated) throw new ConflictException(' cannot assign student due to conflict');
        return updated
    }
    async removeStudent(id:string,studentId:AddOrRemoveStudentDto):Promise<ClassDivisionType>{
        const division = await this.repo.getById(id);
        if (!division) throw new NotFoundException('division not found'); 
        const updated= await this.repo.removeStudent(id,studentId)
        if(!updated) throw new ConflictException(' cannot remove student due to conflict');
        return updated
    }

}