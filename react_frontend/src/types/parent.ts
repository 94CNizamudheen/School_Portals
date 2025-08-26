

export interface ParentForm {
  name?: string;
  email?: string;
  mobileNumber?: string;
  occupation?: string;
  relationship?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

export interface Parent {
    _id: string;
    name: string;
    email: string;
    mobileNumber: string;
    occupation?: string;
    relationship?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
    studentIds?: string[];
    relations: Relation[];
    createdAt?:string
}
export interface Relation {
    admissionId: string;
    relationship: string;
}

