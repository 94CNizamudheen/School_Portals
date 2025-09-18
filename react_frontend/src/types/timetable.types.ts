



export type TimetableType = {
  _id: string;
  division: string;     
  date: Date;         
  day: string;          
  startTime: string;    
  endTime: string;      
  subject: string;
  subjectId: string;
  teacher: string;      
  teacherName?: string;
  color?: string;
  grade?: string;
};
