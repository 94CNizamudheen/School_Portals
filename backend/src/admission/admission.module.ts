
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admission, AdmissionSchema } from './entities/admission.schema';
import { AdmissionService } from './services/admission.service';
import { AdmissionRepository } from './repositories/admission.repository';
import { AdmissionController } from './controllers/admission.controller';
import { TeacherModule } from 'src/teacher/teacher.module'; 
import { CreateAdmissionDto } from './dtos/create-admission.dto';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admission.name, schema: AdmissionSchema }]),
    TeacherModule
  ],
  controllers: [AdmissionController,],
  providers: [
    AdmissionService,
    {
      provide: 'IAdmissionRepository',
      useClass: AdmissionRepository
    }
  ],
  exports:[AdmissionService,'IAdmissionRepository']
})
export class AdmissionModule {}
