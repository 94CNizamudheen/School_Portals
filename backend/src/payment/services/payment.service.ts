import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, Type } from "@nestjs/common";
import { IPaymentRepository } from "../repositories/interfaces/payment.interface.repository";
import { CreatePaymentDto } from "../dtos/create.payment.dto";
import { StudentService } from "src/student/services/student.service";
import { ParentService } from "src/parent/services/parent.service";
import { AdmissionService } from "src/admission/services/admission.service";
import { generateStudentId } from "src/utils/genarate.studentId";
import { AuthRepository } from "src/auth/repositories/auth.repository";


@Injectable()
export class PaymentService {
    private readonly logger= new Logger();
    constructor(
        @Inject('IPaymentRepository')
        private readonly repo: IPaymentRepository,
        @Inject('IAuthRepository')
        private readonly authRepo:AuthRepository,
        private readonly studentService: StudentService,
        private readonly ParentService: ParentService,
        private readonly admissionService: AdmissionService,
        
    ) { };

    async createAdmissionPayment(dto: CreatePaymentDto) {
        this.logger.log(`admission payment invoked with dto ${JSON.stringify(dto)}`)
        const admission = await this.admissionService.getAdmissionById(dto.admissionId);
        if (!admission) throw new NotFoundException("Admission not found");
        if (admission.status !== "approved") throw new BadRequestException('Admission not approved');
        const user= await this.authRepo.findUserByEmail(admission.email);
        if(!user) throw new NotFoundException("User not found for register parent")

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
        if(!student)throw new ForbiddenException("Cant create student")
        const parent = await this.ParentService.findOrCreateParent({
            email: admission.email,
            mobileNumber: admission.mobileNumber,
            name: admission.parentName,
            studentIds: [student._id as string],
            admissionId:dto.admissionId
        })
        this.logger.log("Student",student)

        const updatedPayment= await this.repo.updatePayment({
            paymentId:initilizePayment._id as string ,
            parentId:parent._id as string,
            studentId:student._id as string,
            status:"success"

        })

        if(!updatedPayment) throw new InternalServerErrorException("Failed to update payment");
        if(user.role==="GUEST")user.role="PARENT";

        admission.status= 'completed';
        await user.save();
        await admission.save()
        return {
            message:"Payment completed, student and parent created successfully",
            payment:updatedPayment,
            student,
            parent
        }
    }
}