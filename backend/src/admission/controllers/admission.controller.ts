import { Controller, Post, Body, Get, Param, UseInterceptors, UploadedFiles, BadRequestException, Patch, UseGuards, Logger } from '@nestjs/common';
import { AdmissionService } from '../services/admission.service';
import { CreateAdmissionDto } from '../dtos/create-admission.dto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { UpdateAdmissionDto } from '../dtos/update.admission.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('admissions')
@UseGuards(JwtAuthGuard)
export class AdmissionController {
  private readonly logger = new Logger(AdmissionController.name)
  constructor(private readonly admissionService: AdmissionService) { }

  @Post()
  @UseInterceptors(AnyFilesInterceptor())
  async apply( @Body() body: Omit<CreateAdmissionDto, 'profilePicture' | 'aadharDocument' | 'birthCertificate' | 'transferCertificate'>,@UploadedFiles() files: Array<Express.Multer.File>,) {
    this.logger.debug('controller invoked with ', body);
    this.logger.debug('received files: ', files);

    const fileMap: Record<string, Express.Multer.File[]> = {};
    for (const file of files) {
      if (!fileMap[file.fieldname]) {
        fileMap[file.fieldname] = [];
      }
      fileMap[file.fieldname].push(file);
    }

    await this.admissionService.submitApplication(body, fileMap);
  }

  @Get(':email')
  async fetchAdmissionDetails(@Param('email') email: string) {
    return this.admissionService.fetchAdmissionDetails(email);
  }
  @Get()
  findAll() {
    return this.admissionService.listAll();
  }

  @Patch(':id')
  changeStatus(@Param('id') id: string, @Body() body: UpdateAdmissionDto) {
    return this.admissionService.updateApplicationStatus(id, body);
  }
}