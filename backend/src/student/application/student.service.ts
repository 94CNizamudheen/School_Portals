
import { Injectable, NotFoundException, ForbiddenException, Param, BadRequestException, } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/auth/application/auth.service";
import { Student } from "src/student/domain/student.schema";
import { UpdateStudentDto } from "src/student/infrastructure/dto/student.dto";
import { User } from "src/auth/domain/user.schema";
import { Parent } from "../../parent/domain/parent.schema";
import { AdmissionFormData } from "../infrastructure/student.controller";
import { Types } from "mongoose";
import { v2 as cloudinary } from 'cloudinary';
import * as nodemailer from 'nodemailer'
import { generateAdmissionSummary } from "../infrastructure/utils/email.summary";
import { validateUniqueness } from "../infrastructure/utils/validate.uniqueness";
import { uploadImage } from "../infrastructure/utils/upload.image";
import { createOrUpdateParent } from "../infrastructure/utils/createOrUpdate.parent";
import { createUsers } from "../infrastructure/utils/create.users";
import { Otp, OtpSchema } from "src/auth/domain/otp.schema";

@Injectable()
export class StudentService {
    private transporter: nodemailer.Transporter
    constructor(
        @InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(Parent.name) private parantModel: Model<Parent>,
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Otp.name) private otpModel:Model<Otp>,
        private authService: AuthService
    ) {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });
    };
    async sendVerificationEmail(email: string, admissionData: AdmissionFormData): Promise<void> {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expireAt = new Date(Date.now() + 10 * 60 * 1000); // 24 hours


        const verificationOtp = new this.otpModel({
            email,
            password: otp,
            expireAt,
        });

        await verificationOtp.save();
        const summary = generateAdmissionSummary(admissionData, otp);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Student Admission Application",
            html: summary,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${email}`);
        } catch (error) {
            console.error("Error sending verification email:", error);
            throw new BadRequestException("Failed to send verification email");
        }
    }

    async createAdmission(admissionData: AdmissionFormData, file?: Express.Multer.File): Promise<Student> {
        const { student: studentData, parent: parentData } = admissionData;

        const existingParent = await validateUniqueness(
            this.studentModel, this.parantModel,
            studentData.email, studentData.mobileNumber,
            parentData.email, parentData.mobileNumber
        );
        const student = new this.studentModel({ ...studentData, enrollmentDate: new Date(), parentIds: [], });
        if (file) {
            const imageUrl = await uploadImage(file);
            student.profileImage = imageUrl;
        }

        const savedStudent = await student.save();

        const parent = await createOrUpdateParent(this.parantModel, parentData, savedStudent._id as Types.ObjectId, existingParent);
        student.parentIds = [parent._id as Types.ObjectId];
        await student.save();

        const { password } = await createUsers(this.userModel, studentData.email, parentData.email, savedStudent._id as Types.ObjectId, parent._id as Types.ObjectId);

        console.log(`Student created: ${savedStudent.email}, Password: ${password}`);
        console.log(`Parent created/updated: ${parent.email}, Password: ${password}`);

        return savedStudent;
    };

    async findAll(): Promise<Student[]> {
        return this.studentModel.find().populate('parentIds').exec();
    };

    async findOne(id: string): Promise<Student> {
        const student = await this.studentModel.findById(id).exec();
        if (!student) throw new NotFoundException("Student not found");
        return student;
    };

    async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student | null> {
        const student = await this.studentModel.findById(id).exec();
        if (!student) throw new NotFoundException("student not found");

        if (updateStudentDto.profileImage && student.profileImage) {
            const publicId = student.profileImage.split("/").pop()?.split(".")[0];
            await cloudinary.uploader.destroy(`student_profiles/${publicId}`);
        }

        if (updateStudentDto.email) {
            const existingStudent = await this.studentModel.findOne({ email: updateStudentDto.email });
            if (existingStudent && (existingStudent._id as string).toString() !== id) {
                throw new ForbiddenException('Email already Exists')
            }
            const user = await this.userModel.findOne({ profileId: id });
            if (user) {
                user.email = updateStudentDto.email;
                await user.save();
            }
        };
        if (updateStudentDto.parentIds) {
            for (const parentId of updateStudentDto.parentIds) {
                const parent = await this.parantModel.findById(parentId).exec();
                if (!parent) throw new NotFoundException(`parantId with ${parentId} not found`);
                if (!parent.studentIds) parent.studentIds = [];
                if (!parent.studentIds.some((s_id) => s_id.toString() === id)) {
                    parent.studentIds.push(student.id);
                    await parent.save();
                }
            }
        }
        return this.studentModel.findByIdAndUpdate(id, updateStudentDto, { new: true }).populate('parentIds').exec()
    };

    async delete(id: string): Promise<void> {
        const student = await this.studentModel.findById(id).exec();
        if (!student) throw new NotFoundException("Student not Found");

        if (student.parentIds) {
            for (const parentId of student.parentIds) {
                const parent = await this.parantModel.findById(parentId).exec();
                if (parent && parent.studentIds) {
                    parent.studentIds = parent.studentIds.filter((s_id) => s_id.toString() !== id)
                    await parent.save();
                }
            }
        }

        const publicId = student.profileImage.split("/").pop()?.split(".")[0];
        await cloudinary.uploader.destroy(`student_profiles/${publicId}`);

        await this.userModel.deleteOne({ profileId: id }).exec();
        await this.studentModel.deleteOne({ _id: id });
    }

}


