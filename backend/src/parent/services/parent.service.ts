

import { Injectable, NotFoundException, ForbiddenException, Inject, Logger, BadRequestException } from '@nestjs/common';
import { ParentRepository } from '../repositories/parent.repository';
import { CreateParentDto, } from '../dtos/create-parent.dto';

import { IStudentRepository } from 'src/student/repositories/interfaces/student-repositories.interface';
import { MailService } from 'src/mailer/services/mail.service';
import { SendStudentLoginDetailsDto } from 'src/mailer/dtos/send.mail.dto';

import { studentLoginTemplate } from 'src/mailer/utils/templates/student.login.template';
import { IParentRepository } from '../repositories/interfaces/parent.repository.interface';
import { Parent } from '../entities/parent.schema';
import { IAdmissionRepository } from 'src/admission/repositories/interfaces/admission.repositoriy.interface';
import { Types } from 'mongoose';

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
    if (!dto.admissionIds || dto.admissionIds.length === 0) {
      throw new BadRequestException('admissionIds is required');
    }
    const admission = await this.admissionRepo.findById(dto.admissionIds?.[0]);
    if (!admission) throw new NotFoundException("Admission not found");

    let parent = await this.repo.findByMultipleFields({
      email: admission.email,
      mobileNumber: admission.mobileNumber,
      name: admission.parentName,
    });

    const newAdmissionIdStr = (admission._id as Types.ObjectId | string).toString();
    const newStudentIdsStr = dto.studentIds ?? [];

    if (!parent) {
      parent = await this.repo.createParent({
        name: admission.parentName,
        email: admission.email,
        mobileNumber: admission.mobileNumber,
        occupation: admission.parentOccupation,
        admissionIds: [newAdmissionIdStr],
        studentIds: newStudentIdsStr,
        relations: [{ admissionId: newAdmissionIdStr, relationship: admission.relationToStudent }],
      });
    } else {
      // Update arrays without duplicates
      const updatedAdmissionIds = new Set(parent.admissionIds.map(id => id.toString()));
      updatedAdmissionIds.add(newAdmissionIdStr);

      const updatedStudentIds = new Set(parent.studentIds.map(id => id.toString()));
      newStudentIdsStr.forEach(id => updatedStudentIds.add(id));

      const hasRelation = parent.relations.some(
        r => r.admissionId.toString() === newAdmissionIdStr
      );
      if (!hasRelation) {
        parent.relations.push({
          admissionId: new Types.ObjectId(newAdmissionIdStr),
          relationship: admission.relationToStudent,
        });
      }

      parent.admissionIds = Array.from(updatedAdmissionIds).map(id => new Types.ObjectId(id));
      parent.studentIds = Array.from(updatedStudentIds).map(id => new Types.ObjectId(id));

      parent = await parent.save();
    }

    return parent;
  }


  async sendStudentLoginDetailsMail(dto: SendStudentLoginDetailsDto): Promise<boolean> {
    const { toEmail, studentIdentity, password } = dto;
    const subject = 'Your Student Login Details';
    const text = `Dear Parent`;
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
  async findByEmail(email: string): Promise<Parent | null> {
    if (!email) throw new ForbiddenException('please provide email')
    const parent = await this.repo.findByEmail(email);
    if (!parent) throw new NotFoundException('Parent not found');
    return parent
  }

}
