import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, Type } from "@nestjs/common";
import { IPaymentRepository } from "../repositories/interfaces/payment.interface.repository";
import { CreatePaymentDto } from "../dtos/create.payment.dto";
import { StudentService } from "src/student/services/student.service";
import { ParentService } from "src/parent/services/parent.service";
import { AdmissionService } from "src/admission/services/admission.service";
import { generateStudentId } from "src/utils/genarate.studentId";


@Injectable()
export class PaymentService {
    constructor(
        @Inject('IPaymentRepository')
        private readonly repo: IPaymentRepository,
        private readonly studentService: StudentService,
        private readonly ParentService: ParentService,
        private readonly admissionService: AdmissionService
    ) { };

    async createAdmissionPayment(dto: CreatePaymentDto) {
        const admission = await this.admissionService.getAdmissionById(dto.admissionId);
        if (!admission) throw new NotFoundException("Admission not found");
        if (admission.status !== "approved") throw new BadRequestException('Admission not approved');

        const initilizePayment = await this.repo.createPayment(dto);
        if (!initilizePayment) throw new InternalServerErrorException("Failed to Initialize Payment");

        const studentIdentity = generateStudentId();
        const student = await this.studentService.create({
            firstName: admission.firstName,
            lastName: admission.lastName,
            classLevel: admission.classApplied,
            admissionId: dto.admissionId,
            identity: studentIdentity,
        });
        const parent = await this.ParentService.findOrCreateParent({
            email: admission.email,
            mobileNumber: admission.mobileNumber,
            name: admission.parentName,
            studentIds: [student._id as string]
        })
        const updatedPayment= await this.repo.updatePayment({
            paymentId:initilizePayment._id as string ,
            parentId:parent._id as string,
            studentId:student._id as string,
            status:"success"

        })
        if(!updatedPayment) throw new InternalServerErrorException("Failed to update payment")
        return {
            message:"Payment completed, student and parent created successfully",
            payment:updatedPayment,
            student,
            parent
        }
    }
}