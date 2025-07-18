
import {Injectable, NotFoundException, ForbiddenException,} from '@nestjs/common';
import { ParentRepository } from '../domain/parent.repository';
import { CreateParentDto, UpdateParentDto } from '../infrastructure/dto/parent.dto';

@Injectable()
export class ParentService {
  constructor(private readonly repo: ParentRepository) {}

  async create(dto: CreateParentDto) {
    const exists = await this.repo.findByEmail(dto.email);
    if (exists) throw new ForbiddenException('Parent with this email already exists');

    const randomPassword = Math.random().toString(36).slice(-8);

    const newParent = await this.repo.createParent(dto);

    if (dto.studentIds?.length) {
      for (const studentId of dto.studentIds) {
        const student = await this.repo.addParentToStudent(studentId, newParent.id);
        if (!student) throw new NotFoundException('Student not found');
      }
    }

    await this.repo.createUser(dto.email, randomPassword, newParent.id);

    console.log(`Parent created: ${dto.email}, Password: ${randomPassword}`);
    return newParent;
  }

  async findAll() {
    return this.repo.findAllParents();
  }

  async findOne(id: string) {
    const parent = await this.repo.findParentById(id);
    if (!parent) throw new NotFoundException('Parent not found');
    return parent;
  }

  async update(id: string, dto: UpdateParentDto) {
    const parent = await this.repo.findParentById(id);
    if (!parent) throw new NotFoundException('Parent not found');

    if (dto.email) {
      const existing = await this.repo.findByEmail(dto.email);
      if (existing && existing.id !== id) {
        throw new ForbiddenException('Email already exists');
      }
      await this.repo.updateUserEmail(id, dto.email);
    }

    if (dto.studentIds?.length) {
      for (const sid of dto.studentIds) {
        const student = await this.repo.addParentToStudent(sid, id);
        if (!student) throw new NotFoundException('Student not found');
      }
    }
    await this.repo.updateParent(id,{studentIds:dto.studentIds})
    
    const {studentIds,...rest}=dto;
    await this.repo.updateParent(id,rest)

    const updatedParent= await this.repo.findParentById(id);
    console.log("updatedParent",updatedParent)
    return{
       parent:updatedParent,
       assignedCount:studentIds?.length||0
    }
  }

  async delete(id: string) {
    const parent = await this.repo.findParentById(id);
    if (!parent) throw new NotFoundException('Parent not found');

    await this.repo.removeParentFromAllStudents(id, parent?.studentIds);
    await this.repo.deleteParent(id);
  }
  async findChildrens(id:string){
    const parent= await this.repo.findParentById(id)
    if(!parent) throw new NotFoundException('Parent not found');
    return this.repo.findChildrens(parent.studentIds)
  }
}
