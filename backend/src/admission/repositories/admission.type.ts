

import { Types } from 'mongoose';

export type AdmissionStatus = 'pending' | 'approved' | 'rejected' | 'completed';
export type Gender = 'male' | 'female' | 'transgender';
export type Cast = 'hindu' | 'muslim' | 'christian' | 'sikh' | 'parse' | 'not_disclose';
export type Religion = 'brahmin' | 'kshatriya' | 'vaishya' | 'shudra' | 'kurmi' | 'yadav' | 'nai' | 'teli' |
  'jaiswal' | 'kayastha' | 'baniya' | 'rajput' | 'sc' | 'st' | 'obc' |
  'sunni' | 'shia' | 'syed' | 'pathan' | 'sheikh' | 'mughal' | 'ansari' | 'qureshi' | 'bohra' | 'meman' |
  'roman_catholic' | 'protestant' | 'syro_malabar' | 'syro_malankara' | 'orthodox' | 'pentecostal' | 'jacobite' |
  'jatt' | 'ramgarhia' | 'khatri' | 'rai' | 'ramdassia' | 'mazhabi' | 'tonk_kshatriya' |
  'zoroastrian' | 'agnostic' | 'not_disclosed'

export interface AdmissionType {
  _id?: Types.ObjectId | string;
  firstName: string;
  lastName: string;
  dob: Date;
  cast: Cast;
  religion: Religion
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
  rollNumber?: string
  gender: Gender;
  status: AdmissionStatus;
  verificationNotes?: string;
  rejectionReason?: string;

  createdAt?: Date;
  updatedAt?: Date;
}
