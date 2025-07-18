import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateAdmissionDto } from '../dtos/create-admission.dto';
import { IAdmissionRepository } from '../repositories/interfaces/admission.repositoriy.interface';

@Injectable()
export class AdmissionService {
  constructor(private readonly repo: IAdmissionRepository) {}

  async submitApplication(dto: CreateAdmissionDto) {
    if (dto.previousSchool && !dto.transferCertificate) {
      throw new BadRequestException('Transfer Certificate required with previous school.');
    }
    return this.repo.create(dto);
  }

  async listPendingApplications() {
    return this.repo.findAllPending();
  }

  async getApplicationStatus(id: string) {
    const admission = await this.repo.findById(id);
    if (!admission) throw new NotFoundException('Application not found');
    return { status: admission.status };
  }

  async updateApplicationStatus(id: string, status: string) {
    const admission = await this.repo.findById(id);
    if (!admission) throw new NotFoundException('Application not found');
    await this.repo.updateStatus(id, status);
  }
}