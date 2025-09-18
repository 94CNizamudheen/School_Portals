import { Types } from "mongoose";

export type TimetableSlotType = {
  _id: Types.ObjectId;
  division: Types.ObjectId;     
  date: Date;         
  day: string;          
  startTime: string;    
  endTime: string;      
  subject: string;
  subjectId: string;
  teacher: Types.ObjectId;      
  teacherName?: string;
  color?: string;
  grade?: string;
};
