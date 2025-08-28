import { Inject, Injectable } from "@nestjs/common";
import { IAcademicCalendarRepository } from "./academic.calender.repository.inreface";
import { InjectModel } from "@nestjs/mongoose";
import { AcademicCalendar } from "../entities/academic.calender.schema"; 
import { Model } from "mongoose";
import { CreateAcademicCalendarDto } from "../dtos/create.academic.calender.dto";
import { AcademicCalendarType } from "../types/academic.calender.type.interface";
import { UpdateAcademicCalendarDto } from "../dtos/update.academic.calender.dto";


@Injectable()
export class AcademicCalendarRepository implements IAcademicCalendarRepository{
    constructor(
        @InjectModel(AcademicCalendar.name) private readonly model:Model<AcademicCalendar>
    ){};
    async create(data: CreateAcademicCalendarDto): Promise<AcademicCalendarType> {
        return await this.model.create(data) as AcademicCalendarType;
    }
    async findAll(): Promise<AcademicCalendarType[]> {
        return await this.model.find().lean<AcademicCalendarType[]>() 
    };
    async findById(id: string): Promise<AcademicCalendarType|null> {
        return await this.model.findById(id).lean<AcademicCalendarType|null>().exec()
    };
    async update(id: string, data: UpdateAcademicCalendarDto): Promise<AcademicCalendarType|null> {
        return await this.model.findByIdAndUpdate(id,data,{new:true}).lean<AcademicCalendarType|null>();
    };
    async delete(id: string): Promise<AcademicCalendarType|null> {
        return await this.model.findByIdAndDelete(id).lean<AcademicCalendarType|null>() 
    };

}