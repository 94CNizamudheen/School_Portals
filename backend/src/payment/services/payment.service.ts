import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, Type } from "@nestjs/common";
import { IPaymentRepository } from "../repositories/interfaces/payment.interface.repository";
import { CreatePaymentDto } from "../dtos/create.payment.dto";
import { StudentService } from "src/student/services/student.service";
import { ParentService } from "src/parent/services/parent.service";
import { AdmissionService } from "src/admission/services/admission.service";
import { generateStudentId } from "src/utils/genarate.studentId";
import { AuthRepository } from "src/auth/repositories/auth.repository";
import { Types } from "mongoose";
import { UserRepository } from "src/user/repositories/user.repository";
import { IAuthRepository } from "src/auth/repositories/interfaces/auth-repository.interface";
import { IUserRepository } from "src/user/repositories/interfaces/user.repositoriy.interface";
import { IAdminRepository } from "src/admin/repositories/interfaces/admin-repository.interface";
import { IAdmissionRepository } from "src/admission/repositories/interfaces/admission.repositoriy.interface";
import { IStudentRepository } from "src/student/repositories/interfaces/student-repositories.interface";


@Injectable()
export class PaymentService {
    private readonly logger= new Logger();
    constructor(
        @Inject('IPaymentRepository') private readonly repo: IPaymentRepository,
        @Inject('IAuthRepository') private readonly authRepo:IAuthRepository,
        @Inject ("IUserRepository") private readonly userRepo:IUserRepository,
        @Inject('IAdmissionRepository') private readonly admissionRepo:IAdmissionRepository,
        @Inject("IStudentRepository") private readonly studentRepo:IStudentRepository,
        private readonly studentService: StudentService,
        private readonly ParentService: ParentService,
        private readonly admissionService: AdmissionService,
        
    ) { };

    async createAdmissionPayment(dto: CreatePaymentDto) {
        this.logger.log(`admission payment invoked with dto ${JSON.stringify(dto)}`)
        const admission = await this.admissionService.getAdmissionById(dto.admissionId);
        if (!admission) throw new NotFoundException("Admission not found");
        if (admission.status !== "approved") throw new BadRequestException('Admission not approved');
        const user= await this.userRepo.findUserByEmail(admission.email);
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
        if (!parent) throw new InternalServerErrorException("Can't create parent");
        this.logger.log("Student",student)

        const updatedPayment= await this.repo.updatePayment({
            paymentId:initilizePayment._id as string ,
            parentId:parent._id as string,
            studentId:student._id as string,
            status:"success"
        })

        if(!updatedPayment) throw new InternalServerErrorException("Failed to update payment");
        if(user.role==="GUEST")user.role="PARENT";
        student.parentIds = [parent._id as Types.ObjectId] ;
        admission.status= 'completed';
        admission.verificationNotes="Admission process compleated. Student Login details will get registerd Parent email."
        admission.rejectionReason="";
        await this.userRepo.saveUser(user)
        await this.admissionRepo.saveAdmission(admission)
        await this.studentRepo.saveStudent(student)
        return {
            message:"Payment completed, student and parent created successfully",
            payment:updatedPayment,
            student,
            parent
        }
    }
}