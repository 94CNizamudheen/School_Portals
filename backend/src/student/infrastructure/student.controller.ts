
import { StudentService } from "../application/student.service";
import { Controller, Injectable, UseGuards , Post,Get,Delete, Put, Body, Param, } from "@nestjs/common";
import { CreateStudentDto,UpdateStudentDto } from "./dto/student.dto";
import { JwtAuthGuard } from "src/auth/infrastrucure/jwt-auth.guard";
import { Roles } from "src/auth/infrastrucure/roles.decorator";
import { Role } from "src/auth/infrastrucure/dto/auth.dto";
import { CreateParentDto } from "src/parent/infrastructure/dto/parent.dto";

export interface AdmissionFormData{
    studend:CreateStudentDto;
    parent:CreateParentDto
}

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentController{
    constructor(private readonly studentService:StudentService){}
    @Roles(Role.ADMIN)
    @Post('admission')
    createAdmisiion(@Body() admissionData:AdmissionFormData){
        return this.studentService.createAdmission(admissionData)
    };

    @Roles(Role.ADMIN,Role.PARENT,Role.STUDENT)
    @Get()
    findall(){
        return this.studentService.findAll();
    };

    @Roles(Role.ADMIN,Role.STUDENT,Role.PARENT)
    @Get(':id')
    findOne(@Param('id')id:string){
        return this.studentService.findOne(id)
    };

    @Roles(Role.ADMIN)
    @Delete(':id')
    delete(@Param('id')id:string){
        return this.studentService.delete(id);
    }
}

