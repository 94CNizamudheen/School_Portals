
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Admission, } from '../entities/admission.schema';
import { CreateAdmissionDto } from '../dtos/create-admission.dto';
import { IAdmissionRepository } from './interfaces/admission.repositoriy.interface';
import { UpdateAdmissionDto } from '../dtos/update.admission.dto';

@Injectable()
export class AdmissionRepository implements IAdmissionRepository {
  constructor(
    @InjectModel(Admission.name)
    private readonly model: Model<Admission>
  ) { }

   findById(id: string): Promise<Admission | null> {
    return this.model.findById(id).exec()
  }

   create(dto: CreateAdmissionDto): Promise<Admission> {
    return this.model.create(dto);
  }

   findAll(): Promise<Admission[]> {
    return this.model.find().exec();
  }

   findByEmail(email: string): Promise<Admission[]> {
    return this.model.find({email:email}).exec();
  }

  async updateStatus(id: string, dto: UpdateAdmissionDto): Promise<Admission> {
    const admission = await this.model.findById(id).exec();
    if (!admission) throw new Error('Admission not found');
    admission.status = dto.status;
    admission.verificationNotes = dto.verificationNotes || "";
    

    if (dto.status === 'rejected') {
      admission.rejectionReason = dto.rejectionReason || "No reson provided";
    } else {
      admission.rejectionReason = ''
    }
    return await admission?.save()
  }
  async saveAdmission(admission: Admission): Promise<Admission> {
      return await admission.save()
  }
  
}