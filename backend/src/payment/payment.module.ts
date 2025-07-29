import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Payment, PaymentSchema } from "./entities/payment.schema";
import { ParentModule } from "src/parent/parent.module";
import { StudentModule } from "src/student/student.module";
import { AdmissionModule } from "src/admission/admission.module";
import { TeacherModule } from "src/teacher/teacher.module";
import { PaymentControllers } from "./controllers/payment.controller";
import { PaymentService } from "./services/payment.service";
import { PaymentRepository } from "./repositories/payment.repository";
import { CreatePaymentDto } from "./dtos/create.payment.dto";
import { UpdatePaymentDto } from "./dtos/update.payment.dto";
import { CreateAdmissionDto } from "src/admission/dtos/create-admission.dto";
import { AuthModule } from "src/auth/auth.module";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
        ParentModule,
        StudentModule,
        AdmissionModule,
        TeacherModule,
        AuthModule
    ],
    controllers: [PaymentControllers],
    providers: [PaymentService, { provide: 'IPaymentRepository', useClass: PaymentRepository }],
    exports: [PaymentService, 'IPaymentRepository',]

})

export class PaymentModule { }
