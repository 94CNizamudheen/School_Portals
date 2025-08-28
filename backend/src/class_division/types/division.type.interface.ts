import { Types } from "mongoose";
import { StudentType } from "src/student/repositories/interfaces/student.types";
import { TeacherType } from "src/teacher/repositories/interfaces/teacher.types";

export interface ClassDivisionType{
    _id:Types.ObjectId;
    classLevel:string;
    divisionName:string;
    subjects:string[];
    classTeacherId:TeacherType;
    assignedStudents:StudentType[]
    createdAt?:string;
    updatedAt?:string;
};
