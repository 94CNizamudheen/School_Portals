

import { Types } from "mongoose";


export interface TeacherType {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  profileImage?: string;
  dob: Date;
  address:{
    addressLine:string,
    city:string,
    state:string,
    pincode:string
  }; 
  qualification: string;
  university: string;
  experience: string;
  KTET_CTET_certificateNo: string;
  subject: string;
  eligibilityDocuments: string[];
  status: 'pending' | 'approved' | 'rejected';
  experienceStartDate?: Date;
  createdAt?: string;
  updatedAt?: string;
}