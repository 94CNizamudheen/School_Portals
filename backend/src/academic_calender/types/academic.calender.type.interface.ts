import { Types } from "mongoose";
import { CalendarType } from "./CalenderType.enums";


export interface AcademicCalendarType{
    _id: Types.ObjectId;
    title: string;
    description?: string;
    date: Date;
    endDate?: Date;
    type: CalendarType;
    academicYear?: string;
    applicableClassDivisions: Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}