
import { Injectable, NotFoundException, ForbiddenException, Param, } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AuthService } from "src/auth/application/auth.service";
import { Student } from "src/student/domine/student.schema";
import { CreateStudentDto, UpdateStudentDto } from "src/student/infrastructure/dto/student.dto";
import { User } from "src/auth/domine/user.schema";
import { Parent } from "../../parent/domine/parent.schema";
import * as bcrypt from 'bcrypt';
import { AdmissionFormData } from "../infrastructure/student.controller";
import { Types } from "mongoose";
import { File as MulterFile } from 'multer';
import { v2 as cloudinary } from 'cloudinary';
@Injectable()
export class StudentService {
    constructor(
        @InjectModel(Student.name) private studentModel: Model<Student>,
        @InjectModel(Parent.name) private parantModel: Model<Parent>,
        @InjectModel(User.name) private userModel: Model<User>,
        private authService: AuthService
    ) { }
    async createAdmission(admissionData: AdmissionFormData, file?: MulterFile): Promise<Student> {
        const { studend: studentData, parent: parentData } = admissionData;

        const ex_student = await this.studentModel.findOne({ $or: [{ email: studentData.email }, { mobileNumber: studentData.mobileNumber }] }).exec()
        if (ex_student) {
            throw new ForbiddenException("student with email or Mobile number alreadty exists");
        }
        let parent = await this.parantModel.findOne({ $or: [{ email: parentData.email }, { mobileNumber: parentData.mobileNumber }] }).exec();

        const randomPassWord = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(randomPassWord, 10);
        if (!parent) {
            parent = new this.parantModel({ ...parentData, studentIds: [] })
        }
        const student = new this.studentModel({ ...studentData, enrollmentDate: new Date(), parentIds: [parent._id] });

        parent.studentIds = [...(parent.studentIds || []), student._id as Types.ObjectId];

        let profileImageUrl = '';
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                throw new ForbiddenException('FileSize exceed 5MB')
            };
            if (!["image/jpeg", "image/png"].includes(file.mimetype)) {
                throw new ForbiddenException("Only JPEG and PNG images are allowed");
            }
            try {
                const uploadResult = await new Promise<any>((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { folder: "student_profiles", resource_type: 'image' },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(file.buffer);
                });
                profileImageUrl = uploadResult.secure_url;
            } catch (error) {
                throw new ForbiddenException("Failed to upload image to Cloudinary")
            }
        }

        const savedStudent = await student.save();
        await parent.save()

        const studentUser = new this.userModel({
            email: studentData.email,
            password: hashedPassword,
            role: "STUDENT",
            profileId: savedStudent._id,
        });

        const parentUser = new this.userModel({
            email: parentData.email,
            password: hashedPassword,
            role: "PARENT",
            profileId: parent._id,
        });
        await Promise.all([studentUser.save(), parentUser.save()]);
        console.log(`Student created: ${savedStudent.email}, Password: ${randomPassWord}`);
        console.log(`Parent created/updated: ${parent.email}, Password: ${randomPassWord}`);
        return savedStudent
    }
    // async create(createStudentDto: CreateStudentDto): Promise<Student> {
    //     const existingStudent = await this.studentModel.findOne({ email: createStudentDto.email });
    //     if (existingStudent) throw new ForbiddenException("Email already exists")

    //     const randomPassWord = Math.random().toString(36).slice(-8);
    //     const hashedPassword = await bcrypt.hash(randomPassWord, 10);

    //     const student = new this.studentModel(createStudentDto);
    //     const savedStudent = await student.save();

    //     if (createStudentDto.parentIds) {
    //         for (let parentId of createStudentDto.parentIds) {
    //             const parent = await this.parantModel.findById(parentId).exec();
    //             if (!parent) throw new NotFoundException(`parent with ID ${parentId} not found`);
    //             if (!parent.studentIds) parent.studentIds = [];
    //             if (!parent.studentIds.some((id) => id.toString() === savedStudent.id.toString())) {
    //                 parent.studentIds.push(savedStudent?.id);
    //                 await parent.save();
    //             }
    //         }
    //     }
    //     const user = new this.userModel({
    //         email: createStudentDto.email,
    //         password: hashedPassword,
    //         role: 'STUDENT',
    //         profileId: savedStudent._id
    //     });
    //     await user.save();
    //     console.log(`student created ${savedStudent.email}, password: ${randomPassWord}`);
    //     return savedStudent;
    // };

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


