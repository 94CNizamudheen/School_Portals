// pages/admin/students/admission.tsx
'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StudentFormData, AdmissionFormData } from '@/types/student';
import { FormHeader } from '@/components/forms/FormHeader';
import { ProgressBar } from '@/components/forms/ProgressBar';
import { FormNavigation } from '@/components/forms/FormNavigation';
import { PersonalInformationForm } from '@/components/forms/PersonalInformationForm';
import { AcademicInformationForm } from '@/components/forms/AccademicInformation';
import { ParentInformationForm } from '@/components/forms/ParentInformationForm';
import { MedicalInformationForm } from '@/components/forms/MedicalInformationForm';

const StudentAdmissionForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<StudentFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    nationality: '',
    religion: '',
    grade: '',
    class: '',
    rollNumber: '',
    previousSchool: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    parentOccupation: '',
    relationship: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    medicalConditions: '',
    allergies: '',
    medications: '',
    profileImage: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      profileImage: file,
    }));
  };

  const handleClose = () => {
    router.push('/admin/students');
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      const admissionData: AdmissionFormData = {
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
          profileImage: undefined, // Will be handled by Cloudinary in backend
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
      };

      formDataToSend.append("student", JSON.stringify(admissionData.student));
      formDataToSend.append("parent", JSON.stringify(admissionData.parent));
      if (formData.profileImage) {
        formDataToSend.append("profileImage", formData.profileImage);
      }

      const response = await fetch("/api/students/admission", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token") || ''}`, // Adjust based on your auth setup
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      router.push('/admin/students');
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(error || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInformationForm
            formData={formData}
            onChange={handleInputChange}
            onImageChange={handleImageChange}
          />
        );
      case 2:
        return (
          <AcademicInformationForm
            formData={formData}
            onChange={handleInputChange}
          />
        );
      case 3:
        return (
          <ParentInformationForm
            formData={formData}
            onChange={handleInputChange}
          />
        );
      case 4:
        return (
          <MedicalInformationForm
            formData={formData}
            onChange={handleInputChange}
          />
        );
      default:
        return (
          <PersonalInformationForm
            formData={formData}
            onChange={handleInputChange}
            onImageChange={handleImageChange}
          />
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <FormHeader 
          title="Student Admission Form" 
          onClose={handleClose}
        />
        
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={totalSteps}
        />

        <form onSubmit={(e) => e.preventDefault()}>
          {renderStepContent()}

          <FormNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={prevStep}
            onNext={nextStep}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default StudentAdmissionForm;