
import {Injectable,NotFoundException,ForbiddenException,BadRequestException,} from '@nestjs/common';
import { StudentRepository } from '../domain/student.repository';
import { AdmissionFormData } from '../infrastructure/student.controller';
import { Types } from 'mongoose';
import { uploadImage } from '../infrastructure/utils/upload.image';
import * as nodemailer from 'nodemailer';
import { generateAdmissionSummary } from '../infrastructure/utils/email.summary';
import * as bcrypt from 'bcrypt';
import { User } from 'src/auth/domain/user.schema';
import {v2 as cloudinary } from 'cloudinary'
import { UpdateStudentDto } from '../infrastructure/dto/student.dto';

@Injectable()
export class StudentService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly repo: StudentRepository) {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, admissionData: AdmissionFormData): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = new Date(Date.now() + 10 * 60 * 1000);

    let created= await this.repo.createOtp(email, otp, expireAt);
    console.log(created)
    const summary = generateAdmissionSummary(admissionData, otp);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Student Admission Application',
      html: summary,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new BadRequestException('Failed to send verification email');
    }
  }

  async createAdmission(data: AdmissionFormData, file?: Express.Multer.File) {
    const { student, parent } = data;

    const existingStudent = await this.repo.findStudentByEmailOrPhone(student.email, student.mobileNumber);
    if (existingStudent) throw new ForbiddenException('Student already exists');

    const existingParent = await this.repo.findParentByEmailOrPhone(parent.email, parent.mobileNumber);

    const newStudent = {...student, enrollmentDate: new Date(), parentIds: [],} as any;

    if (file) {
      newStudent.profileImage = await uploadImage(file);
    }

    const savedStudent = await this.repo.createStudent(newStudent);
    const savedParent = await this.repo.createOrUpdateParent(parent, savedStudent._id as string, existingParent);

    savedStudent.parentIds = [savedParent._id as Types.ObjectId];
    await savedStudent.save();

    const randomPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(randomPassword, 10);

    const users: Partial<User>[] = [
      {
        email: student.email,
        password: hashed,
        role: 'STUDENT',
        profileId: savedStudent._id as string,
      },
    ];

    if (!existingParent) {
      users.push({
        email: parent.email,
        password: hashed,
        role: 'PARENT',
        profileId: savedParent._id as string,
      });
    }

    await this.repo.createUsers(users);

    return savedStudent;
  }

  async findAll() {
    return this.repo.findAllStudents();
  }

  async findOne(id: string) {
    const student = await this.repo.findStudentById(id);
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async delete(id: string) {
    const student = await this.repo.findStudentById(id);
    if (!student) throw new NotFoundException('Student not found');

    await this.repo.removeStudentFromParents(id, student.parentIds || []);
    await this.repo.deleteUserByProfileId(id);

    if (student.profileImage) {
      const publicId = student.profileImage.split('/').pop()?.split('.')[0];
      await cloudinary.uploader.destroy(`student_profiles/${publicId}`);
    }

    await this.repo.deleteStudent(id);
  };

  async update(id:string,updateData:UpdateStudentDto){
    const student=  await this.repo.findStudentById(id);
    if (!student) throw new NotFoundException("Student Not Found");
    if(updateData.email && updateData.email!==student.email){
      await this.repo.updateUserEmail(id,updateData.email);
    };
    const updatedStudent= await this.repo.updateStudent(id,updateData)
    return updatedStudent;
  };

  async updateStatus(id:string,isActive:boolean){
    const student= await this.repo.findStudentById(id);
    if(!student) throw new NotFoundException('Student not Found');
    const updatedStudent= this.repo.updateStudent(id,{isActive});
    return updatedStudent;
  }
}
