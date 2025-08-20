import { Types } from "mongoose";
export interface SubjectTypes{
    _id:Types.ObjectId;
    name:string;
    teacherIds:Types.ObjectId[];
    passMark:number;
    totalMark:number;
    subjectType:"Core" | "Language" | "Elective";

}