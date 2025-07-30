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
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/user/user.module";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
        ParentModule,
        StudentModule,
        AdmissionModule,
        TeacherModule,
        AuthModule,
        UserModule
    ],
    controllers: [PaymentControllers],
    providers: [PaymentService, { provide: 'IPaymentRepository', useClass: PaymentRepository }],
    exports: [PaymentService, 'IPaymentRepository',]

})

export class PaymentModule { }
