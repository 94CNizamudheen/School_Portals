import { CreateAcademicCalendarDto } from "../dtos/create.academic.calender.dto";
import { UpdateAcademicCalendarDto } from "../dtos/update.academic.calender.dto";
import { AcademicCalendarType } from "../types/academic.calender.type.interface";

export interface IAcademicCalendar{
    findAll():Promise<AcademicCalendarType[]>;
    findById(id:string):Promise<AcademicCalendarType|null>;
    update(id:string,data:UpdateAcademicCalendarDto):Promise<AcademicCalendarType|null>;
    create(data:CreateAcademicCalendarDto):Promise<AcademicCalendarType>;
    delete(id:string):Promise<AcademicCalendarType|null>
};