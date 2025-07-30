

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ParentRepository } from '../repositories/parent.repository';
import { CreateParentDto,  } from '../dtos/create-parent.dto';
import { UpdateParentDto } from '../dtos/update-parent.dto';

@Injectable()
export class ParentService {
  constructor(private readonly repo: ParentRepository) {}

  async findOne(id: string) {
    const parent = await this.repo.findParentById(id);
    if (!parent) throw new NotFoundException('Parent not found');
    return parent;
  };
  async update(id: string, dto: UpdateParentDto) {
    const parent = await this.repo.findParentById(id);
    if (!parent) throw new NotFoundException('Parent not found');

    if (dto.email) {
      const existing = await this.repo.findByEmail(dto.email);
      if (existing && existing.id !== id) throw new ForbiddenException('Email already exists');
      await this.repo.updateUserEmail(id, dto.email);
    }

    if (dto.studentIds?.length) {
      for (const sid of dto.studentIds) {
        const student = await this.repo.addParentToStudent(sid, id);
        if (!student) throw new NotFoundException('Student not found');
      }
    }

    const { studentIds, ...rest } = dto;
    await this.repo.updateParent(id, { studentIds });
    await this.repo.updateParent(id, rest);

    const updatedParent = await this.repo.findParentById(id);
    return {
      parent: updatedParent,
      assignedCount: studentIds?.length || 0,
    };
  }

  async delete(id: string) {
    const parent = await this.repo.findParentById(id);
    if (!parent) throw new NotFoundException('Parent not found');

    await this.repo.removeParentFromAllStudents(id, parent?.studentIds);
    await this.repo.deleteParent(id);
  }

  async findChildrens(id: string) {
    const parent = await this.repo.findParentById(id);
    if (!parent) throw new NotFoundException('Parent not found');
    return this.repo.findChildrens(parent.studentIds);
  }

  async findOrCreateParent(dto:CreateParentDto){
    let parent= await this.repo.findByEmail(dto.email);
    if(!parent){
      parent= await this.repo.createParent(dto);
    }else{
      await this.repo.pushStudentIds(parent._id as string,dto.studentIds??[])
    }
    return  parent
  }
  
}
