import { BadRequestException, ConflictException, Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { IAcademicCalendarRepository } from "../repositories/academic.calender.repository.inreface";
import { AcademicCalendarType } from "../types/academic.calender.type.interface";
import { CreateAcademicCalendarDto } from "../dtos/create.academic.calender.dto";
import { UpdateAcademicCalendarDto } from "../dtos/update.academic.calender.dto";


@Injectable()
export class AcademicCalendarService {
    private readonly logger = new Logger(AcademicCalendarService.name);
    constructor(
        @Inject("IAcademicCalendarRepository") private readonly repo: IAcademicCalendarRepository
    ) { };

    async create(data: CreateAcademicCalendarDto): Promise<AcademicCalendarType> {
        try {
            const entryDate = new Date(data.date);
            if (isNaN(entryDate.getTime())) throw new BadRequestException('Invalid date Format');
            let academicYear: string;
            const month = entryDate.getMonth() + 1;
            const year = entryDate.getFullYear();
            if (month >= 6) {
                academicYear = `${year}-${year + 1}`
            } else {
                academicYear = `${year - 1}-${year}`;
            }

            const created = await this.repo.create({...data,academicYear});
            if (!created) throw new InternalServerErrorException("Failed to create academic calendar");
            return created;
        } catch (err) {
            if (err.code === 11000) throw new ConflictException("An academic calendar entry already exists for this date");
            throw new InternalServerErrorException("Database error: " + err.message);
        }
    };
    async findAll(): Promise<AcademicCalendarType[]> {
        const datas = await this.repo.findAll();
        if (!datas || datas.length === 0) throw new NotFoundException('No datas found');
        return datas;
    };
    async findById(id: string): Promise<AcademicCalendarType | null> {
        const details = await this.repo.findById(id);
        if (!details) throw new NotFoundException(`No data found with _id:${id} `);
        return details
    };
    async update(id: string, data: UpdateAcademicCalendarDto): Promise<AcademicCalendarType | null> {
        const updated = await this.repo.update(id, data);
        if (!updated) throw new NotFoundException(`Cant Find and update with _id:${id}`);
        return updated;
    };
    async delete(id: string): Promise<AcademicCalendarType | null> {
        const deleted = await this.repo.delete(id);
        if (!deleted) throw new NotFoundException(`Cant Find and Delete with _id:${id}`);
        return deleted;
    }
}