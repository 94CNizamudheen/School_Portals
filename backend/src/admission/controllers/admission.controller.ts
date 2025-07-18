import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AdmissionService } from '../services/admission.service';
import { CreateAdmissionDto } from '../dtos/admission.dto';

@Controller('admissions')
export class AdmissionController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Post()
  apply(@Body() dto: CreateAdmissionDto) {
    return this.admissionService.submitApplication(dto);
  }

  @Get(':id/status')
  checkStatus(@Param('id') id: string) {
    return this.admissionService.getApplicationStatus(id);
  }
}