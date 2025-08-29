import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ISchoolEventRepository } from "../repositories/event.repository.interface";
import { SchoolEventType } from "../types/event.types.interface";
import { CreateSchoolEventDto } from "../dtos/create.event.dto";
import { uploadImage } from "src/common/utils/upload.image";
import { UpdateSchoolEventDto } from "../dtos/update.event.dto";


@Injectable()
export class SchoolEventService {
    constructor(
        @Inject('ISchoolEventRepository') private readonly repo: ISchoolEventRepository,
    ) { }
    async create(data: CreateSchoolEventDto, file: Express.Multer.File): Promise<SchoolEventType> {
        if (!file) throw new BadRequestException("Poster file is required");
        let poster: string;
        try {
            poster = await uploadImage(file);
        } catch (err) {
            throw new InternalServerErrorException("Failed to upload poster file");
        }
        const fulldata = { ...data, poster };
        const createdEvent = await this.repo.create(fulldata);
        if (!createdEvent) throw new ConflictException('Failed to create school event');
        return createdEvent;
    };
    async update(id: string, data: UpdateSchoolEventDto, file?: Express.Multer.File): Promise<SchoolEventType | null> {
        const exists = await this.repo.findById(id);
        if (!exists) throw new BadRequestException(`Event not found with _id:${id}`)
        let poster: string | undefined;
        if (file) {
            try {
                poster = await uploadImage(file);
            } catch (err) {
                throw new InternalServerErrorException("Failed to upload poster file");
            }
        }
        const fulldata = { ...data, ...(poster ? { poster } : {}) };
        const uploaded = await this.repo.update(id, fulldata)
        if (!uploaded) throw new ConflictException("Failed to update school event");
        return uploaded
    };
    async findAll(): Promise<SchoolEventType[]> {
        const events= await this.repo.findAll();
        if(events.length===0) throw new NotFoundException('Events not found');
        return events;
    };
    async findById(id:string):Promise<SchoolEventType|null>{
        const event= await this.repo.findById(id);
        if(!event) throw new NotFoundException(`Event not found with _id${id}`);
        return event;
    }
    async delete(id:string):Promise<SchoolEventType|null>{
        const event= await this.repo.delete(id);
        if(!event) throw new NotFoundException(`Event not found with _id${id}`);
        return event;
    }

}