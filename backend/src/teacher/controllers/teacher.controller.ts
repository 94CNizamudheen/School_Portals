

import { Put,Post,Get,Body,Param,Controller,UseGuards,Delete, UseInterceptors, UploadedFile, UploadedFiles, Logger, Patch } from "@nestjs/common";
import { TeacherService } from "../service/teacher.service";
import { CreateTeacherDto } from "../dtos/create-teacher.dto"; 
import { UpdateTeacherDto } from "../dtos/update-teacher.dto";
import { Roles } from "src/auth/roles.decorator";
import { Role } from "src/auth/dtos/register.dtos"; 
import { AnyFilesInterceptor, FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("teachers")
@UseGuards(JwtAuthGuard)
export class TeacherController{
    private readonly logger= new Logger(TeacherController.name)
    constructor(private readonly teacherService:TeacherService){}

    
    @Post('apply')
    @UseInterceptors(AnyFilesInterceptor())
    aplly(@UploadedFiles()files:Array<Express.Multer.File>, @Body()body:CreateTeacherDto){
        this.logger.log("files ",files);
        this.logger.log("body ",body);
        return this.teacherService.apply(body,files)
    };
    @Patch('verify-and-create/:teacherId')
    @Roles(Role.ADMIN)
    verrifyAndCreate(@Param('teacherId')teacherId:string){
        return this.teacherService.verifyAndCreate(teacherId);
    }
    @Patch('reject-application/:teacherId')
    @Roles(Role.ADMIN)
    rejectApplivation(@Param('teacherId')teacherId:string){
        return this.teacherService.rejectApplication(teacherId);
    }


    @Roles(Role.ADMIN,Role.TEACHER)
    @Get()
    findAll(){
        return this.teacherService.findAll();
    }

    // @Roles(Role.TEACHER,Role.ADMIN)
    // @Get(':id')
    // findOne(@Param('id')id:string){
    //     return this.teacherService.findOne(id);
    // };

    // @Roles(Role.ADMIN)
    // @Put(":id")
    // update(@Param('id')id:string,@Body()update_dto:UpdateTeacherDto){
    //     return this.teacherService.update(id,update_dto)
    // }
    @Roles(Role.ADMIN)
    @Delete(":id")
    delete(@Param('id')id:string){
        return this.teacherService.delete(id);
    }

}


