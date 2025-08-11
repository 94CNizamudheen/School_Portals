import { BadRequestException, ForbiddenException, Inject, Injectable, Logger, NotFoundException, } from '@nestjs/common';
import { TeacherRepository } from '../repositories/teacher.repository';
import { CreateTeacherDto } from '../dtos/create-teacher.dto';
import { UpdateTeacherDto } from '../dtos/update-teacher.dto';
import { uploadImage } from 'src/utils/upload.image';
import { IUserRepository } from 'src/user/repositories/interfaces/user.repositoriy.interface';
import { ITeacherRepository } from '../repositories/interfaces/teacher.repository.interface';
import { uploadDocument } from 'src/utils/upload.document';
import { rejectTeacherTemplate } from 'src/mailer/utils/templates/teacher.reject.mail.template';
import { MailService } from 'src/mailer/services/mail.service';
import { Teacher } from '../entities/teacher.schema';

@Injectable()
export class TeacherService {
  private readonly logger = new Logger(TeacherService.name)
  constructor(
    @Inject('ITeacherRepository') private readonly repo: ITeacherRepository,
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    @Inject() private readonly mailService:MailService
  ) { }
  async apply(body: CreateTeacherDto, files: Express.Multer.File[]) {
    const existingTeacher = await this.repo.findOneEmailOrMobile( body.mobileNumber,body.email);
    if (existingTeacher) {
      this.logger.log(existingTeacher)
      throw new BadRequestException('A teacher with this email or mobile number already exists');
    }
    const photofile = files.find(file => file.fieldname === 'photo');
    if (!photofile) {
      throw new BadRequestException('Photo is required');
    }
    const documentFiles = files.filter(file => file.fieldname === 'document');
    const profileImage = await uploadImage(photofile)
    const eligibilityDocuments = await Promise.all(
      documentFiles.map(async (file) => {
        return await uploadDocument(file)
      })
    )

    const address = { addressLine: body.addressLine, city: body.city, state: body.state, pincode: body.pincode };
    const { experience, ...rest } = body;
    const teacherData = { ...rest, address, profileImage, experience, eligibilityDocuments }
    return await this.repo.apply(teacherData)
  }

  async verifyAndCreate(teacherId: string) {
    const teacher = await this.repo.findById(teacherId);
    this.logger.log(teacher)
    if (!teacher) throw new BadRequestException('Cant find teacher with this Id');
    const user = await this.userRepo.findUserByEmail(teacher.email);
    if (!user) throw new BadRequestException('cant find the user with provided teacher email');
    teacher.status = 'approved'
    teacher.experienceStartDate = new Date()
    user.role = "TEACHER";
    await this.userRepo.saveUser(user);
    await this.repo.saveTeacher(teacher);
    return teacher
  }
  async rejectApplication(teacherId:string){
    const teacher= await this.repo.findById(teacherId);
    if(!teacher) throw new NotFoundException("teacher with this id not found");
    teacher.status="rejected";
    await this.repo.saveTeacher(teacher);
    const subject= 'Your Teacher Application Status';
    const text=`Dear ${teacher.firstName},\n\nWe regret to inform you that your application has been rejected.\n\nRegards,\nSchool Admin`;
    const html= rejectTeacherTemplate(teacher.firstName);
    try {
      await this.mailService.sendMail({to:teacher.email,subject,text,html})
    } catch (error) {
      this.logger.error(`Failed to send rejection email to ${teacher.email}`),
      error.stack||error.message
    }
    return teacher
  }

  async findAll() {
    return this.repo.findAll();
  }
  async findByEmail(email:string):Promise<Teacher|null>{
    if(!email) throw new ForbiddenException('Email not provided');
    return await this.repo.findByEmail(email)
  }

  async findOne(id: string) {
    const teacher = await this.repo.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    return teacher;
  }

  async update(id: string, dto: UpdateTeacherDto) {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing && (existing._id as string).toString() !== id) {
      throw new ForbiddenException('Email already exists');
    }

    return this.repo.updateTeacher(id,dto );
  }

  async delete(id: string) {
    const teacher = await this.repo.findById(id);
    if (!teacher) throw new NotFoundException('Teacher not found');

    await this.repo.deleteTeacher(id);
    await this.userRepo.deleteUser(id)
  }
}
