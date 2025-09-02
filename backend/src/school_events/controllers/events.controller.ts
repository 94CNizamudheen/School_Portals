import { Body, Controller, Delete, Get, Inject, Logger, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { SchoolEventService } from "../services/events.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { SchoolEventType } from "../types/event.types.interface";
import { CreateSchoolEventDto } from "../dtos/create.event.dto";
import { UpdateSchoolEventDto } from "../dtos/update.event.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";




@Controller('events')
// @UseGuards(JwtAuthGuard)
@UseGuards(AuthGuard('jwt'))
export class SchoolEventController {
    private readonly logger= new Logger()
    constructor(
        private readonly schoolEventService: SchoolEventService,
    ) { };
    @Post()
    @UseInterceptors(FileInterceptor('posterFile'))
    async createEvent(@Body() data: CreateSchoolEventDto, @UploadedFile() file: Express.Multer.File): Promise<SchoolEventType> {
        return await this.schoolEventService.create(data, file);
    }
    @Patch(':id')
    @UseInterceptors(FileInterceptor('posterFile'))
    async updateEvent(@Param('id') id: string, @Body() data: UpdateSchoolEventDto, @UploadedFile() file?: Express.Multer.File): Promise<SchoolEventType | null> {
         this.logger.debug(`datas ${JSON.stringify(data)} poster: ${file?.originalname}`);
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