

import { Put,Post,Get,Body,Param,Controller,UseGuards,Delete, UseInterceptors, UploadedFile } from "@nestjs/common";
import { TeacherService } from "../service/teacher.service";
import { CreateTeacherDto } from "../dtos/create-teacher.dto"; 
import { UpdateTeacherDto } from "../dtos/update-teacher.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard"; 
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/auth/dtos/register.dtos"; 
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("teachers")
@UseGuards(JwtAuthGuard)
export class TeacherController{
    constructor(private readonly teacherService:TeacherService){}

    @Roles(Role.ADMIN)
    @UseInterceptors(FileInterceptor('profileImage'))
    @Post()
    create(@UploadedFile()file:Express.Multer.File, @Body()create_dto:CreateTeacherDto){
        return this.teacherService.create(create_dto,file)
    };

    @Roles(Role.ADMIN,Role.TEACHER)
    @Get()
    findAll(){
        return this.teacherService.findAll();
    }

    @Roles(Role.TEACHER,Role.ADMIN)
    @Get(':id')
    findOne(@Param('id')id:string){
        return this.teacherService.findOne(id);
    };

    @Roles(Role.ADMIN)
    @Put(":id")
    update(@Param('id')id:string,@Body()update_dto:UpdateTeacherDto){
        return this.teacherService.update(id,update_dto)
    }
    @Roles(Role.ADMIN)
    @Delete(":id")
    delete(@Param('id')id:string){
        return this.teacherService.delete(id);
    }

}


