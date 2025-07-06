
import { StudentFormData, AdmissionFormData } from '@/types/student';

export const createAdmissionData = (formData: StudentFormData): AdmissionFormData => ({
  student: {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    mobileNumber: formData.phone,
    dateOfBirth: formData.dateOfBirth || undefined,
    gender: formData.gender || undefined,
    bloodGroup: formData.bloodGroup || undefined,
    nationality: formData.nationality || undefined,
    religion: formData.religion || undefined,
    grade: formData.grade || undefined,
    class: formData.class || undefined,
    rollNumber: formData.rollNumber || undefined,
    previousSchool: formData.previousSchool || undefined,
    address: formData.address || undefined,
    city: formData.city || undefined,
    state: formData.state || undefined,
    pincode: formData.pincode || undefined,
    medicalConditions: formData.medicalConditions || undefined,
    allergies: formData.allergies || undefined,
    medications: formData.medications || undefined,
    profileImage: undefined,
  },
  parent: {
    name: formData.parentName,
    email: formData.parentEmail,
    mobileNumber: formData.parentPhone,
    occupation: formData.parentOccupation || undefined,
    relationship: formData.relationship || undefined,
    emergencyContactName: formData.emergencyContactName || undefined,
    emergencyContactPhone: formData.emergencyContactPhone || undefined,
    emergencyContactRelationship: formData.emergencyContactRelationship || undefined,
  },
});