import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { AdmissionService } from '../services/admission.service';

@Controller('admin/admissions')
export class AdmissionAdminController {
  constructor(private readonly admissionService: AdmissionService) {}

  @Get()
  findPending() {
    return this.admissionService.listPendingApplications();
  }

  @Patch(':id')
  changeStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.admissionService.updateApplicationStatus(id, status);
  }
}