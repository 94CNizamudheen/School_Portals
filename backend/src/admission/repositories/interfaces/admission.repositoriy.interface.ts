
import { UpdateAdmissionDto } from 'src/admission/dtos/update.admission.dto';
import { Admission, AdmissionDocument } from '../../entities/admission.schema';
import { CreateAdmissionDto } from 'src/admission/dtos/create-admission.dto';

export interface IAdmissionRepository {
  create(dto: CreateAdmissionDto): Promise<Admission>;
  findAll(): Promise<Admission[]>;
  findById(id: string): Promise<AdmissionDocument | null>;
  updateStatus(id: string, dto: UpdateAdmissionDto): Promise<Admission>;
  findByEmail(email: string): Promise<Admission | null>;
}