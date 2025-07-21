"use client"

import { useState } from "react"
import type { AdmissionFormData } from "@/types/admission.types"

// Mock data
const mockAdmissions: AdmissionFormData[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    dob: "2010-05-15",
    address: "123 Main St, City",
    profilePicture: new File([], "profile.jpg"),
    bloodGroup: "A+",
    aadharDocument: new File([], "aadhar.pdf"),
    birthCertificate: new File([], "birth.pdf"),
    previousSchool: "ABC Elementary School",
    transferCertificate: new File([], "transfer.pdf"),
    medicalInformation: "No known allergies",
    parentName: "Jane Doe",
    relationToStudent: "Mother",
    email: "jane.doe@email.com",
    mobileNumber: "+1234567890",
    emergencyContactName: "Bob Doe",
    emergencyContactNumber: "+1234567891",
    parentOccupation: "Engineer",
    classApplied: "Grade 8",
    nationality: "Indian",
    state: "Maharashtra",
    pincode: "400001",
    status: "pending",
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Smith",
    dob: "2009-08-22",
    address: "456 Oak Ave, Town",
    profilePicture: new File([], "profile.jpg"),
    bloodGroup: "B+",
    aadharDocument: new File([], "aadhar.pdf"),
    birthCertificate: new File([], "birth.pdf"),
    previousSchool: "XYZ Public School",
    transferCertificate: new File([], "transfer.pdf"),
    medicalInformation: "Asthma - requires inhaler",
    parentName: "Mike Smith",
    relationToStudent: "Father",
    email: "mike.smith@email.com",
    mobileNumber: "+1234567892",
    emergencyContactName: "Lisa Smith",
    emergencyContactNumber: "+1234567893",
    parentOccupation: "Doctor",
    classApplied: "Grade 9",
    nationality: "Indian",
    state: "Karnataka",
    pincode: "560001",
    status: "approved",
    submittedAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    firstName: "Raj",
    lastName: "Patel",
    dob: "2011-03-10",
    address: "789 Pine Rd, Village",
    profilePicture: new File([], "profile.jpg"),
    bloodGroup: "O+",
    aadharDocument: new File([], "aadhar.pdf"),
    birthCertificate: null,
    previousSchool: "DEF International School",
    transferCertificate: null,
    medicalInformation: "None",
    parentName: "Priya Patel",
    relationToStudent: "Mother",
    email: "priya.patel@email.com",
    mobileNumber: "+1234567894",
    emergencyContactName: "Amit Patel",
    emergencyContactNumber: "+1234567895",
    parentOccupation: "Business Owner",
    classApplied: "Grade 7",
    nationality: "Indian",
    state: "Gujarat",
    pincode: "380001",
    status: "refill_requested",
    submittedAt: "2024-01-13T09:15:00Z",
    rejectionReason:
      "Missing birth certificate and transfer certificate. Please upload these documents to proceed with the application.",
    refillRequestedAt: "2024-01-16T11:30:00Z",
  },
]

export const useAdmissionData = () => {
  const [admissions, setAdmissions] = useState<AdmissionFormData[]>(mockAdmissions)

  const updateAdmissionStatus = (
    id: string,
    status: "approved" | "rejected" | "refill_requested",
    notes?: string,
    rejectionReason?: string,
  ) => {
    setAdmissions((prev) =>
      prev.map((admission) =>
        admission.id === id
          ? {
              ...admission,
              status,
              verificationNotes: notes,
              rejectionReason,
              ...(status === "refill_requested" && { refillRequestedAt: new Date().toISOString() }),
            }
          : admission,
      ),
    )
  }

  return {
    admissions,
    updateAdmissionStatus,
  }
}
