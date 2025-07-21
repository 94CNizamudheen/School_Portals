import { Controller, Post, Body, Get, Param, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { AdmissionService } from '../services/admission.service';
import { CreateAdmissionDto } from '../dtos/create-admission.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('admissions')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) { }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'aadharDocument', maxCount: 1 },
    { name: 'birthCertificate', maxCount: 1 },
    { name: 'transferCertificate', maxCount: 1 },
  ]))
  async apply(
    @UploadedFiles()
    files: {
      profilePicture?: Express.Multer.File[];
      aadharDocument?: Express.Multer.File[];
      birthCertificate?: Express.Multer.File[];
      transferCertificate?: Express.Multer.File[];

    },
    @Body() body: Omit<CreateAdmissionDto, | 'profilePicture' | 'aadharDocument' | 'birthCertificate' | 'transferCertificate'>,) {
    if (body.previousSchool && !files.transferCertificate) {
      throw new BadRequestException('Transfer Certificate required with previous school.')
    }
    return this.admissionService.submitApplication(body, files);
  }

  @Get(':id/status')
  async checkStatus(@Param('id') id: string) {
    return this.admissionService.getApplicationStatus(id);
  }
}