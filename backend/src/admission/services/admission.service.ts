import { Injectable, BadRequestException, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CreateAdmissionDto } from '../dtos/create-admission.dto';
import { IAdmissionRepository } from '../repositories/interfaces/admission.repositoriy.interface';
import { uploadImage } from 'src/common/utils/upload.image';
import { uploadDocument } from 'src/common/utils/upload.document';
import { UpdateAdmissionDto } from '../dtos/update.admission.dto';

type CreateAdmissionFormDto = Omit<CreateAdmissionDto, 'profilePicture' | 'aadharDocument' | 'birthCertificate' | 'transferCertificate'>;


@Injectable()
export class AdmissionService {
  private readonly logger= new Logger(AdmissionService.name)
  constructor(@Inject('IAdmissionRepository') private readonly repo: IAdmissionRepository) {}

  async submitApplication(dto: CreateAdmissionFormDto,files:Record<string,Express.Multer.File[]>) {
    this.logger.log(`submit application invoked with ${JSON.stringify(dto)}`)
    const profilePictureUrl=await uploadImage(files.profilePicture![0])
    const aadharDocumentUrl= await uploadDocument(files.aadharDocument![0]);
    const birthCertificateUrl= await uploadDocument(files.birthCertificate![0]);
    const transferCertificateUrl= files.transferCertificate ? await uploadDocument(files.transferCertificate[0] ): undefined

    const fullDto:CreateAdmissionDto={
      ...dto,
      profilePicture:profilePictureUrl,
      aadharDocument:aadharDocumentUrl,
      birthCertificate:birthCertificateUrl,
      transferCertificate:transferCertificateUrl
    }


    return this.repo.create(fullDto);
  }

  async listAll() {
    return this.repo.findAll();
  }

  async fetchAdmissionDetails(email: string) {
    const admissions = await this.repo.findByEmail(email);
    if (!admissions ||admissions.length===0) throw new NotFoundException('Application not found');
    return  admissions ;
  }

  async updateApplicationStatus(id:string,dto:UpdateAdmissionDto) {
    const admission = await this.repo.findById(id);
    if (!admission) throw new NotFoundException('Application not found');
    await this.repo.updateStatus(id, dto);
  }
  async getAdmissionById(id:string){
    const admission= await this.repo.findById(id)
    return admission
  }
};
