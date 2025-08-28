import { Injectable } from "@nestjs/common";
import { ISchoolEventRepository } from "./event.repository.interface";
import { InjectModel } from "@nestjs/mongoose";
import { SchoolEvent } from "../entities/school.events.schema";
import { Model } from "mongoose";
import { CreateSchoolEvent } from "../dtos/create.event.dto";
import { SchoolEventType } from "../types/event.types.interface";
import { UpdateSchoolEvent } from "../dtos/update.event.dto";

@Injectable()
export class SchoolEventRepository implements ISchoolEventRepository{
    constructor(
        @InjectModel(SchoolEvent.name)private readonly model:Model<SchoolEvent>
    ){};
    async create(data: CreateSchoolEvent): Promise<SchoolEventType> {
        return await this.model.create(data) as SchoolEventType
    };
    async findAll(): Promise<SchoolEventType[]> {
        return await this.model.find().lean<SchoolEventType[]>()
    };
    async findById(id: string): Promise<SchoolEventType | null> {
        return await this.model.findById(id).lean<SchoolEventType|null>();
    };
    async update(id: string, data: UpdateSchoolEvent): Promise<SchoolEventType | null> {
        return await this.model.findByIdAndUpdate(id,data,{new:true}).lean<SchoolEventType|null>()
    };
    async delete(id: string): Promise<SchoolEventType | null> {
        return await this.model.findByIdAndDelete(id).lean<SchoolEventType|null>()
    };
}