

export interface Division {
  _id: string;
  classLevel:string;        
  divisionName: string;      
  subjects: string[];
  classTeacherId:string
  createdAt?: string; 
  updatedAt?: string; 
  capacity?:number;
  assignedStudents?:string[]
}
