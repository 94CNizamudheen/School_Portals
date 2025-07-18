
import { Admission } from '../../entities/admission.schema';
import { CreateAdmissionDto } from 'src/admission/dtos/admission.dto';

export interface IAdmissionRepository {
  create(dto: CreateAdmissionDto): Promise<Admission>;
  findAllPending(): Promise<Admission[]>;
  findById(id: string): Promise<Admission | null>;
  updateStatus(id: string, status: string): Promise<void>;
}