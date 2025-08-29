import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AcademicCalendarService } from "../services/academic.calender.service";
import { AcademicCalendarType } from "../types/academic.calender.type.interface";
import { CreateAcademicCalendarDto } from "../dtos/create.academic.calender.dto";
import { UpdateAcademicCalendarDto } from "../dtos/update.academic.calender.dto";


@Controller('academic-calender')
@UseGuards(AuthGuard('jwt'))
export class AcademicCalendarController{
    constructor(
       private readonly academicCalendarService:AcademicCalendarService,
    ){};
    @Get()
    async getAcademicCalendarEntries():Promise<AcademicCalendarType[]>{
        return await  this.academicCalendarService.findAll()
    };
    @Get(':id')
    async getAcademicCalendarEntryById(@Param('id')id:string):Promise<AcademicCalendarType|null>{
        return await this.academicCalendarService.findById(id)
    };
    @Post()
    async createAcademicCalendarEntry(@Body()data:CreateAcademicCalendarDto):Promise<AcademicCalendarType>{
        return await this.academicCalendarService.create(data);
    };
    @Patch(':id')
    async updateAcademicCalendarEntry(@Param('id')id:string,@Body()data:UpdateAcademicCalendarDto):Promise<AcademicCalendarType|null>{
        return await this.academicCalendarService.update(id,data)
    };
    @Delete(':id')
    async deleteAcademicClaendarEntry(@Param('id')id:string):Promise<AcademicCalendarType|null>{
        return await this.academicCalendarService.delete(id)
    }
}