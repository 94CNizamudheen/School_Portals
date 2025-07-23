import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { AdmissionService } from '../services/admission.service';
import { UpdateAdmissionDto } from '../dtos/update.admission.dto';

@Controller('admin/admissions')
export class AdmissionAdminController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Get()
  findAll() {
    return this.admissionService.listAll();
  } 

  @Patch(':id')
  changeStatus(@Param('id') id: string, @Body()body:UpdateAdmissionDto ) {
    return this.admissionService.updateApplicationStatus(id,body);
  }
}