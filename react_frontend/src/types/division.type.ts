

export interface Division {
  _id: string;        
  divisionName: string;      
  subjects: string[];
  classTeacherId:string
  createdAt?: string; 
  updatedAt?: string; 
  assignedStudentsId?:string[]
}
