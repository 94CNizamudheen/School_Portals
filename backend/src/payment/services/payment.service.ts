import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException, Type } from "@nestjs/common";
import { IPaymentRepository } from "../repositories/interfaces/payment.interface.repository";
import { CreatePaymentDto } from "../dtos/create.payment.dto";
import { StudentService } from "src/student/services/student.service";
import { ParentService } from "src/parent/services/parent.service";
import { AdmissionService } from "src/admission/services/admission.service";
import { generateStudentId } from "src/utils/genarate.studentId";
import * as bcrypt from 'bcrypt'
import { Types } from "mongoose";
import { IUserRepository } from "src/user/repositories/interfaces/user.repositoriy.interface";
import { IAdmissionRepository } from "src/admission/repositories/interfaces/admission.repositoriy.interface";
import { IStudentRepository } from "src/student/repositories/interfaces/student-repositories.interface";
import { generateRandomPassword } from "src/utils/generate.random.password";


@Injectable()
export class PaymentService {
    private readonly logger = new Logger();
    constructor(
        @Inject('IPaymentRepository') private readonly repo: IPaymentRepository,
        @Inject("IUserRepository") private readonly userRepo: IUserRepository,
        @Inject('IAdmissionRepository') private readonly admissionRepo: IAdmissionRepository,
        @Inject("IStudentRepository") private readonly studentRepo: IStudentRepository,
        private readonly studentService: StudentService,
        private readonly ParentService: ParentService,
        private readonly admissionService: AdmissionService,

    ) { };

    async createAdmissionPayment(dto: CreatePaymentDto) {
        this.logger.log(`Admission payment invoked with dto ${JSON.stringify(dto)}`);

        const admission = await this.admissionService.getAdmissionById(dto.admissionId);
        if (!admission) throw new NotFoundException("Admission not found");
        if (admission.status !== "approved") throw new BadRequestException("Admission not approved");

        const user = await this.userRepo.findUserByEmail(admission.email);
        if (!user) throw new NotFoundException("User not found for parent registration");

        const initialPayment = await this.repo.createPayment(dto);
        if (!initialPayment) throw new InternalServerErrorException("Failed to initialize payment");

        const studentIdentity = generateStudentId();
        const plainPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const student = await this.studentService.create({
            admissionId: dto.admissionId,
            identity: studentIdentity,
            password: hashedPassword
        });
        if (!student) throw new InternalServerErrorException("Student creation failed");
        if (!student._id) throw new Error("Student _id is missing");
        const parent = await this.ParentService.findOrCreateParent({
            studentIds: [student._id?.toString()],
            admissionIds: [dto.admissionId],
            relations: [{ admissionId: dto.admissionId, relationship: admission.relationToStudent }],
        });
        if (!parent) throw new InternalServerErrorException("Failed to create or find parent");

        const updatedPayment = await this.repo.updatePayment({
            paymentId: initialPayment._id as string,
            parentId: parent._id as string,
            studentId: student._id as string,
            status: "success"
        });
        if (!updatedPayment) throw new InternalServerErrorException("Failed to update payment");

        const sendMail = await this.ParentService.sendStudentLoginDetailsMail({
            toEmail: parent.email,
            studentIdentity: student.identity,
            password: plainPassword
        });
        if (!sendMail) throw new ForbiddenException("Failed to send student login email");

        if (user.role === "GUEST") user.role = "PARENT";

        student.parentIds = [parent._id as Types.ObjectId];
        admission.status = "completed";
        admission.verificationNotes = "Admission process completed. Login credentials sent to registered parent email.";

        await Promise.all([
            this.userRepo.saveUser(user),
            this.admissionRepo.saveAdmission(admission),
            this.studentRepo.saveStudent(student)
        ]);

        return {
            message: "Payment completed, student and parent created successfully",
            payment: updatedPayment,
            student,
            parent
        };
    }

}