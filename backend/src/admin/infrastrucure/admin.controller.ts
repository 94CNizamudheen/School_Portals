
import { Controller,Get,Post,Put,Delete,Param,Body, UseGuards } from "@nestjs/common";
import { AdminService } from "../application/admin.service";
import { CreateAdminDto,UpdateAdminDto } from "./admin.dto";
import { CreateTeacherDto, UpdateTeacherDto } from "src/teacher/infrastruture/dto/teacher.dto";
import { CreateParentDto, UpdateParentDto } from "src/parent/infrastructure/dto/parent.dto";
import { JwtAuthGuard } from "src/auth/infrastrucure/jwt-auth.guard";
import { Role } from "src/auth/infrastrucure/dto/auth.dto";
import { Roles } from "src/auth/infrastrucure/roles.decorator";
import { AdmissionFormData } from "src/student/infrastructure/student.controller";
@Controller('admins')
@UseGuards(JwtAuthGuard)
export class AdminController{
    constructor(private readonly adminService:AdminService){};

    @Roles(Role.ADMIN)
    @Post()
    create(@Body()createDto:CreateAdminDto){
        return this.adminService.create(createDto);
    }
    @Roles(Role.ADMIN)
    @Put(':id')
    update(@Param('id')id:string,@Body()updateDto:UpdateAdminDto){
        return this.adminService.update(id,updateDto);
    };

    @Roles(Role.ADMIN)
    @Get()
    findAll(){
        return this.adminService.findAll();
    };

    @Roles(Role.ADMIN)
    @Get(':id')
    findOne(@Param('id')id:string){
        return this.adminService.findOne(id);
    };

    @Roles(Role.ADMIN)
    @Post(':id')
    createAdmission(@Body()admissionData:AdmissionFormData){
        return this.adminService.createAdmission(admissionData);
    };

    @Roles(Role.ADMIN)
    @Put(':id')
    updateStudent(@Param('id')id:string,@Body()dto:UpdateAdminDto){
        return this.adminService.updateStudent(id,dto)
    };

    @Roles(Role.ADMIN)
    @Post()
    createTeacher(@Param()createDto:CreateTeacherDto){
        return this.adminService.createTeacher(createDto);
    };

    @Roles(Role.ADMIN)
    @Put(':id')
    updateTeacher(@Param('id')id:string,@Body()updateDto:UpdateTeacherDto){
        return this.adminService.updateTeacher(id,updateDto);
    };

    @Roles(Role.ADMIN)
    @Post()
    createParent(@Body()createDto:CreateParentDto){
        return this.adminService.createParent(createDto);
    };

    @Roles(Role.ADMIN)
    @Put(':id')
    updateParent(@Param('id')id:string,@Body()updateDto:UpdateParentDto){
        return this.adminService.updateParent(id,updateDto)
    };

    @Roles(Role.ADMIN)
    @Delete(':id')
    delete(@Param('id')id:string){
        return this.adminService.delete(id)
    }

};

