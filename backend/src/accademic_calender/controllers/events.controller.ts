import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SchoolEventService } from "../services/events.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { SchoolEventType } from "../types/event.types.interface";
import { CreateSchoolEventDto } from "../dtos/create.event.dto";
import { UpdateSchoolEventDto } from "../dtos/update.event.dto";




@Controller('events')
@UseGuards(AuthGuard('jwt'))
export class SchoolEventController {
    constructor(
        private readonly schoolEventService: SchoolEventService,
    ) { };
    @Post()
    @UseInterceptors(FileInterceptor('posterUrl'))
    async createEvent(@Body() data: CreateSchoolEventDto,@UploadedFile() file: Express.Multer.File): Promise<SchoolEventType> {
        return await this.schoolEventService.create(data, file);
    }
    @Patch(':id')
    @UseInterceptors(FileInterceptor('posterUrl'))
    async updateEvent(@Param('id') id: string, @Body() data: UpdateSchoolEventDto, @UploadedFile() file?: Express.Multer.File): Promise<SchoolEventType | null> {
        return await this.schoolEventService.update(id, data, file);
    };
    @Get()
    async getAllEvents(): Promise<SchoolEventType[]> {
        return await this.schoolEventService.findAll();
    };
    @Get(':id')
    async getEventById(@Param() id: string): Promise<SchoolEventType | null> {
        return await this.schoolEventService.findById(id);
    }
    @Delete(':id')
    async removeEvent(@Param('id') id: string): Promise<SchoolEventType | null> {
        return await this.schoolEventService.delete(id)
    }
}