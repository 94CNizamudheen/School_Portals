import { Types } from "mongoose";

export interface StudentType {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  classLevel: string;
  identity: string;
  password: string;
  religion: string;
  cast: string;
  admissionId: Types.ObjectId;
  parentIds?: Types.ObjectId[];
  rollNumber?: string;
  class?: string;
  dob?: Date;
  gender?: string;
  bloodGroup?: string;
  nationality?: string;
  address?: string;
  state?: string;
  pincode?: string;
  mobileNumber?: string;
  email?: string;
  previousSchool?: string;
  medicalInformation?: string;
  profilePicture?: string;
  isActive: boolean;
  enrollmentDate?: Date;
  createdAt?: string;
  updatedAt?: string;
}