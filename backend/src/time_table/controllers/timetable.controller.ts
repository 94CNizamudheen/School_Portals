import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { TimetableSlotService } from "../services/timetable.service";
import { CreateTimetableSlotDto } from "../dtos/create-timetable.dto";
import { TimetableSlotType } from "../types/timetable.types";
import { UpdateTimetableDto } from "../dtos/update-timetable.dto";


@Controller('timetable')
@UseGuards(JwtAuthGuard)
export class TimetableSlotcontroller {
    constructor(
        @Inject() private readonly service: TimetableSlotService
    ) { }
    @Post()
    async create(@Body() slot: CreateTimetableSlotDto): Promise<TimetableSlotType> {
        return await this.service.create(slot);
    }
    @Post('bulk/:division/:month')
    async bulkSave(@Param('division') division: string, @Param('month') month: string, @Body() slots: CreateTimetableSlotDto[]): Promise<TimetableSlotType[]> {
        return await this.service.bulksave(division, month, slots)
    }
    @Get()
    async findByDivisionAndMonth(@Query('division') division: string, @Query('month') month: string): Promise<TimetableSlotType[]> {
        return await this.service.getDivisionTimetable(division, month)
    };
    @Get('teacher/:teacherId/:month')
    async findByTeacherAndMonth(@Param('teacherId') teacherId: string, @Param('month') month: string): Promise<TimetableSlotType[]> {
        return await this.service.getTeacherSchedule(teacherId, month)
    };
    @Get(':id')
    async getSlot(@Param('id') id: string): Promise<TimetableSlotType|null> {
        return await this.service.getSlot(id)
    }
    @Put(':id')
    async updateSlot(@Param('id')id:string,@Body()data:UpdateTimetableDto):Promise<TimetableSlotType|null>{
        return await this.service.updateSlot(id,data)
    };
    @Delete(':id')
    async deleteSlot(@Param('id')id:string){
        return await this.service.deleteSlot(id)
    }


}