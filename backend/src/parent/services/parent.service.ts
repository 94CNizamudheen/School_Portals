

import { Injectable, NotFoundException, ForbiddenException, Inject, Logger } from '@nestjs/common';
import { ParentRepository } from '../repositories/parent.repository';
import { CreateParentDto, } from '../dtos/create-parent.dto';
import { UpdateParentDto } from '../dtos/update-parent.dto';
import { IStudentRepository } from 'src/student/repositories/interfaces/student-repositories.interface';
import { MailService } from 'src/mailer/services/mail.service';
import { SendStudentLoginDetailsDto } from 'src/mailer/dtos/send.mail.dto';
import * as path from 'path';
import * as fs from 'fs';
import { studentLoginTemplate } from 'src/mailer/utils/templates/student.login.template';
import { IParentRepository } from '../repositories/interfaces/parent.repository.interface';
import { Parent } from '../entities/parent.schema';
import { IAdmissionRepository } from 'src/admission/repositories/interfaces/admission.repositoriy.interface';

@Injectable()
export class ParentService {
  private readonly logger = new Logger(ParentService.name)
  constructor(
    @Inject("IParentRepository") private readonly repo: IParentRepository,
    @Inject("IAdmissionRepository") private readonly admissionRepo: IAdmissionRepository,
    private readonly mailService: MailService

  ) { }

  async findOne(id: string) {
    const parent = await this.repo.findParentById(id);
    if (!parent) throw new NotFoundException('Parent not found');
    return parent;
  };
  // async update(id: string, dto: UpdateParentDto) {
  //   const parent = await this.repo.findParentById(id);
  //   if (!parent) throw new NotFoundException('Parent not found');

  //   if (dto.email) {
  //     const existing = await this.repo.findByEmail(dto.email);
  //     if (existing && existing.id !== id) throw new ForbiddenException('Email already exists');
  //     await this.repo.updateUserEmail(id, dto.email);
  //   }

  //   if (dto.studentIds?.length) {
  //     for (const sid of dto.studentIds) {
  //       const student = await this.repo.addParentToStudent(sid, id);
  //       if (!student) throw new NotFoundException('Student not found');
  //     }
  //   }

  //   const { studentIds, ...rest } = dto;
  //   await this.repo.updateParent(id, { studentIds });
  //   await this.repo.updateParent(id, rest);

  //   const updatedParent = await this.repo.findParentById(id);
  //   return {
  //     parent: updatedParent,
  //     assignedCount: studentIds?.length || 0,
  //   };
  // }

  // async delete(id: string) {
  //   const parent = await this.repo.findParentById(id);
  //   if (!parent) throw new NotFoundException('Parent not found');

  //   await this.repo.removeParentFromAllStudents(id, parent?.studentIds);
  //   await this.repo.deleteParent(id);
  // }

  async findChildrens(id: string) {
    const parent = await this.repo.findParentById(id);
    if (!parent) throw new NotFoundException('Parent not found');
    return this.repo.findChildrens(parent.studentIds);
  }

  async findOrCreateParent(dto: CreateParentDto) {
    const admission = await this.admissionRepo.findById(dto.admissionId);
    if (!admission) throw new NotFoundException("Admission not found");

    let parent = await this.repo.findByMultipleFields({
      email: admission.email,
      mobileNumber: admission.mobileNumber,
      name: admission.parentName,
      relationToStudent: admission.relationToStudent
    });

    if (!parent) {
      parent = await this.repo.createParent(dto, admission.toObject());
    } else {
      await this.repo.pushStudentIds(parent._id as string, dto.studentIds ?? []);
    }

    return parent;
  }

  async sendStudentLoginDetailsMail(dto: SendStudentLoginDetailsDto): Promise<boolean> {
    const { toEmail, studentIdentity, password } = dto;
    const subject = 'Your Student Login Details';
    const text = `Student ID: ${studentIdentity}, Password: ${password}`;
    const html = studentLoginTemplate(studentIdentity, password);
    try {
      await this.mailService.sendMail({ to: toEmail, subject, text, html });
      return true;
    } catch (err) {
      this.logger.error(`Failed to send login email to ${dto.toEmail}`, err);
      return false;
    }
  };
  async findAll(): Promise<Parent[]> {
    const parents = await this.repo.findAllParents();
    this.logger.log('parents', parents)
    if (!parents || parents.length === 0) throw new NotFoundException("parents not found");
    return parents
  }
}
