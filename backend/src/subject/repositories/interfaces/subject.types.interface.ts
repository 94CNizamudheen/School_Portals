import { Types } from "mongoose";
export interface SubjectTypes{
    _id:Types.ObjectId;
    name:string;
    assignedTeachers:Types.ObjectId[];
    passMark:number;
    totalMark:number;
    subjectType:"Core" | "Language" | "Elective";

}