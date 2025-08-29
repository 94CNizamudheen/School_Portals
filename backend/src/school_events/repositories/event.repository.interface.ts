import { CreateSchoolEventDto } from "../../school_events/dtos/create.event.dto";
import { UpdateSchoolEventDto } from "../../school_events/dtos/update.event.dto";
import { SchoolEventType } from "../types/event.types.interface"; 


export interface ISchoolEventRepository{
    findAll():Promise<SchoolEventType[]>;
    create(data:CreateSchoolEventDto):Promise<SchoolEventType>;
    update(id:string,data:UpdateSchoolEventDto):Promise<SchoolEventType|null>;
    findById(id:string,):Promise<SchoolEventType|null>;
    delete(id:string,):Promise<SchoolEventType|null>;
}