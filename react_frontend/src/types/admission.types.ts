export interface AdmissionFormData {
  firstName: string
  lastName: string
  gender: string;
  religion: string;
  cast: string;
  dob: string
  address: string
  profilePicture: File | null
  bloodGroup: string
  aadharDocument: File | null
  birthCertificate: File | null
  previousSchool: string
  transferCertificate: File | null
  medicalInformation: string
  parentName: string
  relationToStudent: string
  email: string
  mobileNumber: string
  emergencyContactName: string
  emergencyContactNumber: string
  parentOccupation: string
  classApplied: string
  nationality: string
  state: string
  pincode: string
  status: "pending" | "approved" | "rejected" | "completed"
  verificationNotes?: string
  rejectionReason?: string
}

export type AdmissionFormErrors = Partial<Record<keyof AdmissionFormData, string>>;

export type HandleInputChange = (name: keyof AdmissionFormData, value: string) => void;
export type HandleFileChange = (name: keyof AdmissionFormData, file: File | null) => void;
export type FileFieldKeys =  | "profilePicture" | "aadharDocument" | "birthCertificate"  | "transferCertificate";

export interface DocumentPreview {
  url: string
  type: string
  name: string
}

export interface AdmissionFiles {
  profilePicture?: File|null;
  aadharDocument?:  File|null;
  birthCertificate?:  File|null;
  transferCertificate?:  File|null;
}