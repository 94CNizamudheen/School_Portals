import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SubjectSerivice } from "../service/subject.service";
import { CreateSubjectDto } from "../dtos/create.subject.dto";
import { UpdateSubjectDto } from "../dtos/update.subject.dto";



@Controller('subjects')
@UseGuards(AuthGuard('jwt'))
export class SubjectController{
    constructor(
        @Inject() private readonly subjectService:SubjectSerivice,
    ){}
    @Get()
    async findAllSubject(){
        return await this.subjectService.findAllSubject();
    }
    @Post()
    async createSubject(@Body()data:CreateSubjectDto){
        return await this.subjectService.createSubject(data);
    }
    @Patch(':id')
    async updateSubject(@Param('id')id:string, @Body()data:UpdateSubjectDto){
        return await this.subjectService.updateSubject(id,data)
    }
    @Patch('assign-teacher/:id')
    async assignTeacher(@Param('id')id:string,@Body('teacherId')teacherId:string){
        return await this.subjectService.assignTeacher(id,teacherId);
    }

    @Patch('remove-teacher/:id')
    async removeTeacher(@Param('id')id:string,@Body('teacherId')teacherId:string){
        return await this.subjectService.removeTeacher(id,teacherId);
    }
    @Get(':id')
    async findSubjectById(@Param('id')id:string){
        return await this.subjectService.findSubjectById(id)
    }
     @Get('by-name')
    async findSubjectByName(@Query('name')name:string){
        return await this.subjectService.findSubjectByName(name)
    }
    @Delete(':id')
    async removeSubject(@Param('id')id:string){
        return await this.subjectService.removeSubject(id);
    }
}