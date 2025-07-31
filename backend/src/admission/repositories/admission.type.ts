

import { Types } from 'mongoose';

export type AdmissionStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type Gender = 'male' | 'female' | 'transgender';

export interface AdmissionType {
  _id?: Types.ObjectId|string;
  firstName: string;
  lastName: string;
  dob: Date;
  address: string;
  state: string;
  nationality: string;
  pincode: string;
  profilePicture: string;
  bloodGroup: string;
  aadharDocument: string;
  birthCertificate: string;
  previousSchool?: string;
  transferCertificate?: string;
  medicalInformation?: string;

  parentName: string;
  relationToStudent: string;
  email: string;
  mobileNumber: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  parentOccupation?: string;

  classApplied: string;
  rollNumber?:string
  gender: Gender;
  status: AdmissionStatus;
  verificationNotes?: string;
  rejectionReason?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
