
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Admission, AdmissionSchema } from './entities/admission.schema';
import { AdmissionService } from './services/admission.service';
import { AdmissionRepository } from './repositories/admission.repository';
import { AdmissionController } from './controllers/admission.controller';
import { AdmissionAdminController } from './controllers/admission-admin.controller';
import { TeacherModule } from 'src/teacher/teacher.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admission.name, schema: AdmissionSchema }]),
    TeacherModule
  ],
  controllers: [AdmissionController, AdmissionAdminController],
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
