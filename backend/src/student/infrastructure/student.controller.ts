
import { StudentService } from "../application/student.service";
import { Controller, UseGuards, Post, Get, Delete, Patch, Body, Param, UseInterceptors, UploadedFile, Req } from "@nestjs/common";
import { CreateStudentDto, UpdateStudentDto } from "./dto/student.dto";
import { JwtAuthGuard } from "src/auth/infrastrucure/jwt-auth.guard";
import { Roles } from "src/auth/infrastrucure/roles.decorator";
import { Role } from "src/auth/infrastrucure/dto/auth.dto";
import { CreateParentDto } from "src/parent/infrastructure/dto/parent.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { uploadImage } from "./utils/upload.image";

export interface AdmissionFormData {
    student: CreateStudentDto;
    parent: CreateParentDto
}

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @Roles(Role.ADMIN)
    @Post("send-verification-email")
    async sendVerificationEmail(@Body() admissionData: AdmissionFormData) {
        return this.studentService.sendVerificationEmail(admissionData.parent.email, admissionData);
    }
    @Roles(Role.ADMIN)
    @Post('admission')
    @UseInterceptors(FileInterceptor('profileImage'))

    async createAdmisiion(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
        const admissionData: AdmissionFormData = {
            student: JSON.parse(body.student),
            parent: JSON.parse(body.parent)
        }
        return this.studentService.createAdmission(admissionData, file)
    };

    @Roles(Role.ADMIN, Role.PARENT, Role.STUDENT)
    @Get()
    async findall() {
        return this.studentService.findAll();
    };

    @Roles(Role.ADMIN, Role.STUDENT, Role.PARENT)
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.studentService.findOne(id)
    };
    @Patch(':id')
    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('ProfileImage'))
    async update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto,@UploadedFile()file?:Express.Multer.File) {
        if(file){
            const imageUrl= await uploadImage(file)
            updateStudentDto.profileImage=imageUrl;
        }
        return this.studentService.update(id, updateStudentDto);
    };

    @Patch(':id/status')
    @Roles(Role.ADMIN)
    async updateStatus(@Param('id') id: string, @Body() statusDto: { isActive: boolean }) {
        return this.studentService.updateStatus(id, statusDto.isActive);
    }


    @Roles(Role.ADMIN)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.studentService.delete(id);
    }
}

