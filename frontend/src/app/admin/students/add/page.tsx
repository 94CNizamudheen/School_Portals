'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { StudentFormData, AdmissionFormData } from '@/types/student';
import { FormHeader } from '@/components/forms/FormHeader';
import { ProgressBar } from '@/components/forms/ProgressBar';
import { FormNavigation } from '@/components/forms/FormNavigation';
import { PersonalInformationForm } from '@/components/forms/PersonalInformationForm';
import { AcademicInformationForm } from '@/components/forms/AccademicInformation';
import { ParentInformationForm } from '@/components/forms/ParentInformationForm';
import { MedicalInformationForm } from '@/components/forms/MedicalInformationForm';
import {toast} from 'react-toastify';

const StudentAdmissionForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const totalSteps = 4;
  const API= process.env.NEXT_PUBLIC_BACKEND_URL;
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'parentEmail') {
      setIsEmailVerified(false);
      setVerificationToken(null);
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPEG and PNG images are allowed');
        return;
      }
    }
    setFormData(prev => ({
      ...prev,
      profileImage: file,
    }));
  };

  const handleClose = () => {
    router.push('/admin/students');
  };

  const handleSendVerificationEmail = async (admissionData: AdmissionFormData) => {
    if (!formData.parentEmail) {
      toast.error('Please enter a parent email address');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/students/send-verification-email`, admissionData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      toast.success('Verification email sent! Please ask the parent to verify their email.');

      console.error('Error sending verification email:',);
      toast.error( 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!formData.parentEmail || !verificationToken) {
      alert('Please send a verification email first or enter a valid token');
      return;
    }
    setLoading(true);
    try {
      await axios.get(`${API}/students/verify-email`, {
        params: {
          email: formData.parentEmail,
          token: verificationToken,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      setIsEmailVerified(true);
      alert('Email verified successfully!');
    } catch (error) {
      console.error('Error verifying email:', error);
      toast.error('Email not verified');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isEmailVerified) {
      alert('Please verify the parent email before submitting');
      return;
    }

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
      };

      formDataToSend.append('student', JSON.stringify(admissionData.student));
      formDataToSend.append('parent', JSON.stringify(admissionData.parent));
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
      formDataToSend.append('verificationToken', verificationToken || '');

      await axios.post(`${API}/students/admission`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push('/admin/students');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
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
        return <AcademicInformationForm formData={formData} onChange={handleInputChange} />;
      case 3:
        return <ParentInformationForm formData={formData} onChange={handleInputChange} />;
      case 4:
        return <MedicalInformationForm formData={formData} onChange={handleInputChange} />;
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
        <FormHeader title="Student Admission Form" onClose={handleClose} />
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <form onSubmit={(e) => e.preventDefault()}>
          {renderStepContent()}
          <FormNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevious={prevStep}
            onNext={nextStep}
            onSubmit={handleSubmit}
            onSendVerification={handleSendVerificationEmail}
            formData={formData}
            loading={loading}
            isEmailVerified={isEmailVerified}
            verificationToken={verificationToken}
            setVerificationToken={setVerificationToken}
            handleCheckVerification={handleCheckVerification}
          />
        </form>
      </div>
    </div>
  );
};

export default StudentAdmissionForm;
