// types/student.ts
export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  nationality: string;
  religion: string;
  grade: string;
  class: string;
  rollNumber: string;
  previousSchool: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  parentOccupation: string;
  relationship: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
 emergencyContactRelationship: string;
  medicalConditions: string;
  allergies: string;
  medications: string;
  profileImage: File | null;
}

export interface AdmissionFormData {
  student: {
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    dateOfBirth?: string;
    gender?: string;
    bloodGroup?: string;
    nationality?: string;
    religion?: string;
    grade?: string;
    class?: string;
    rollNumber?: string;
    previousSchool?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    medicalConditions?: string;
    allergies?: string;
    medications?: string;
    profileImage?: File | null;
  };
  parent: {
    name: string;
    email: string;
    mobileNumber: string;
    occupation?: string;
    relationship?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelationship?: string;
  };
}