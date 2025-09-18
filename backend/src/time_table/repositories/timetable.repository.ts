import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ITimetableSlotRepository } from "../interfaces/timtable.repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { TimetableSlot } from "../entities/timetable.schema";
import { Model, Types } from "mongoose";
import { TimetableSlotType } from "../types/timetable.types";
import { CreateTimetableSlotDto } from "../dtos/create-timetable.dto";
import { UpdateTimetableDto } from "../dtos/update-timetable.dto";


@Injectable()
export class TimetableSlotRepostory implements ITimetableSlotRepository{
    constructor(
        @InjectModel(TimetableSlot.name) private  model:Model<TimetableSlot>,
    ){}
    private monthRange(month:string){
        const parts= month.split('-').map(Number);
        if(parts.length<2) throw new BadRequestException('month must be YYYY-MM');
        const[year,m]= parts;
        const start= new Date(Date.UTC(year,m-1,1));
        const end= new Date(Date.UTC(year,m,1));
        return {start,end}
    }
    async create(slot: CreateTimetableSlotDto): Promise<TimetableSlotType> {
        const created= new this.model({
            ...slot,
            date:new Date(slot.date),
            division:new Types.ObjectId(slot.division),
            teacher:new Types.ObjectId(slot.teacher)
        });
        const saved= await created.save();
        return saved.toObject() as TimetableSlotType
    };
    async bulkReplace(division: string, month: string, slots: CreateTimetableSlotDto[]): Promise<TimetableSlotType[]> {
        const {start,end}=this.monthRange(month);
        await this.model.deleteMany({division,date:{$gte:start,$lt:end}});
        if(!slots.length) return [];
        const intoInsert= slots.map((s)=>({
            ...s,
            date:new Date(s.date),
            division: new Types.ObjectId(s.division),
            teacher: new Types.ObjectId(s.teacher)
        }));
        const docs= await this.model.insertMany(intoInsert);
        return docs.map((d)=>d.toObject()) as unknown as TimetableSlotType[]
    };
    async findByDivisionAndMonth(division: string, month: string): Promise<TimetableSlotType[]> {
        const {start,end}= this.monthRange(month);
        const docs= await this.model.find({division,date:{$gte:start,$lt:end}}).sort({date:1,startTime:1}).lean();
        return docs as unknown as TimetableSlotType[]

    }
    async findById(id: string): Promise<TimetableSlotType | null> {
        return await this.model.findById(id).lean() as unknown as TimetableSlotType
    }
    async update(id: string, slot: UpdateTimetableDto): Promise<TimetableSlotType | null> {
        return await this.model.findByIdAndUpdate(id,slot,{new:true}).lean() as unknown as TimetableSlotType
    };
    async delete(id: string): Promise<void> {
        await this.model.findByIdAndDelete(id)
    }
    async findByTeacherAndMonth(teacherId: string, month: string): Promise<TimetableSlotType[]> {
        const {start,end}= this.monthRange(month);
        return await this.model.find({teacher:teacherId,date:{$gte:start,$lt:end}})
    }
}