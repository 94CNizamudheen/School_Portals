import { CreateTimetableSlotDto } from "../dtos/create-timetable.dto";
import { UpdateTimetableDto } from "../dtos/update-timetable.dto";
import { TimetableSlotType } from "../types/timetable.types";


export interface ITimetableSlotRepository{
    create(slot:CreateTimetableSlotDto):Promise<TimetableSlotType>;
    bulkReplace(division:string,month:string,slots:CreateTimetableSlotDto[]):Promise<TimetableSlotType[]>;
    findByDivisionAndMonth(divisionId:string,month:string):Promise<TimetableSlotType[]>;
    findById(id:string):Promise<TimetableSlotType|null>;
    update(id:string,slot:UpdateTimetableDto):Promise<TimetableSlotType|null>
    delete(id:string):Promise<void>
    findByTeacherAndMonth(teacherId:string,month:string):Promise<TimetableSlotType[]>;
}