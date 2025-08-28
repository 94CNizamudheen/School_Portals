import { CreateSchoolEvent } from "../dtos/create.event.dto";
import { UpdateSchoolEvent } from "../dtos/update.event.dto";
import { SchoolEventType } from "../types/event.types.interface";


export interface ISchoolEventRepository{
    findAll():Promise<SchoolEventType[]>;
    create(data:CreateSchoolEvent):Promise<SchoolEventType>;
    update(id:string,data:UpdateSchoolEvent):Promise<SchoolEventType|null>;
    findById(id:string,):Promise<SchoolEventType|null>;
    delete(id:string,):Promise<SchoolEventType|null>;
}