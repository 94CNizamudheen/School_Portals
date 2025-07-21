import { Injectable, BadRequestException, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CreateAdmissionDto } from '../dtos/create-admission.dto';
import { IAdmissionRepository } from '../repositories/interfaces/admission.repositoriy.interface';
import { uploadImage } from 'src/shared/utils/upload.image';
import { uploadDocument } from 'src/shared/utils/upload.document';

@Injectable()
export class AdmissionService {
  private readonly logger= new Logger(AdmissionService.name)
  constructor(@Inject('IAdmissionRepository') private readonly repo: IAdmissionRepository) {}

  async submitApplication(dto: Omit<CreateAdmissionDto, | 'profilePicture'| 'aadharDocument'| 'birthCertificate'| 'transferCertificate'>,files:Record<string,Express.Multer.File[]>) {
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