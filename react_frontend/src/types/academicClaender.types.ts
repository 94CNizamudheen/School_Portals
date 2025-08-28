
export type CalendarTypeEnums = "exam" | "holiday" | "event" | "off_day";
export interface Holiday{
    _id?:string;
    title:string;
    description?:string;
    date:string;
    endDate?:string;
    type: CalendarTypeEnums;
    academicYear?:string;
    applicableClassDivisions:string[];
    createdAt?: string;
    updatedAt?:string;
}