
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Admission, AdmissionDocument } from '../entities/admission.schema';
import { CreateAdmissionDto } from '../dtos/create-admission.dto';
import { IAdmissionRepository } from './interfaces/admission.repositoriy.interface';

@Injectable()
export class AdmissionRepository implements IAdmissionRepository {
  constructor(
    @InjectModel(Admission.name)
    private readonly model: Model<AdmissionDocument>
  ) {}

  async create(dto: CreateAdmissionDto): Promise<Admission> {
    return this.model.create(dto);
  }

  async findAllPending(): Promise<Admission[]> {
    return this.model.find({ status: 'Pending' }).exec();
  }

  async findById(id: string): Promise<Admission | null> {
    return this.model.findById(id).exec();
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { status });
  }
}