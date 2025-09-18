import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { TimetableSlotRepostory } from "../repositories/timetable.repository";
import { CreateTimetableSlotDto } from "../dtos/create-timetable.dto";
import { TimetableSlotType } from "../types/timetable.types";
import { UpdateTimetableDto } from "../dtos/update-timetable.dto";


@Injectable()
export class TimetableSlotService {
    constructor(
        @Inject('ITimetableSlotRepostory') private readonly repo: TimetableSlotRepostory
    ) { };
    async create(slot: CreateTimetableSlotDto) {
        return this.repo.create(slot)
    }
    async bulksave(divisionId: string, month: string, slots: CreateTimetableSlotDto[]) {
        if (!divisionId || !month) throw new BadRequestException('divisionId and month are required');
        if (!Array.isArray(slots)) throw new BadRequestException('slots must be an array');
        return this.repo.bulkReplace(divisionId, month, slots);
    }
    async getDivisionTimetable(divisionId: string, month: string) {
        if (!divisionId || !month) {
            throw new BadRequestException('divisionId and month are required');
        }
        return this.repo.findByDivisionAndMonth(divisionId, month);
    }
    async getSlot(id: string): Promise<TimetableSlotType> {
        if (!id) throw new BadRequestException('id is required');
        const slot = await this.repo.findById(id);
        if (!slot) throw new NotFoundException(`Slot with id ${id} not found`);

        return slot;
    };
    async updateSlot(id: string, dto: UpdateTimetableDto): Promise<TimetableSlotType> {
        if (!id) throw new BadRequestException('id is required');
        const updated = await this.repo.update(id, dto);
        if (!updated) throw new NotFoundException(`Slot with id ${id} not found`);

        return updated;
    }

    async deleteSlot(id: string): Promise<void> {
        if (!id) throw new BadRequestException('id is required');
        const existing = await this.repo.findById(id);
        if (!existing) throw new NotFoundException(`Slot with id ${id} not found`);

        return this.repo.delete(id);
    }

    async getTeacherSchedule(teacherId: string, month: string): Promise<TimetableSlotType[]> {
        if (!teacherId || !month) {
            throw new BadRequestException('teacherId and month are required');
        }
        return this.repo.findByTeacherAndMonth(teacherId, month);
    }
}