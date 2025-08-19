

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './entities/student.schema';
import { Parent, ParentSchema } from 'src/parent/entities/parent.schema';
import { Otp, OtpSchema } from 'src/auth/entities/otp.schema';
import { User, UserSchema } from 'src/user/entities/user.schema';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { StudentRepository } from './repositories/student.repository';
import { AdmissionModule } from 'src/admission/admission.module';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Parent.name, schema: ParentSchema },
      { name: Otp.name, schema: OtpSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AdmissionModule,
    
  ],
  controllers: [StudentController],
  providers: [StudentService, {provide:"IStudentRepository",useClass:StudentRepository}],
  exports:[StudentService,"IStudentRepository"]
})
export class StudentModule {}
