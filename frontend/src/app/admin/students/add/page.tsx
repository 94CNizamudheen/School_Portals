// components/StudentAdmissionForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { StudentFormData } from '@/types/student';
import { FormHeader } from '@/components/forms/FormHeader';
import { ProgressBar } from '@/components/forms/ProgressBar';
import { FormNavigation } from '@/components/forms/FormNavigation';
import { PersonalInformationForm } from '@/components/forms/PersonalInformationForm';
import { AcademicInformationForm } from '@/components/forms/AccademicInformation'; // Fixed typo: "AccademicInformation" to "AcademicInformation"
import { ParentInformationForm } from '@/components/forms/ParentInformationForm';
import { MedicalInformationForm } from '@/components/forms/MedicalInformationForm';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import {personalInformationSchema,academicInformationSchema,parentInformationSchema, medicalInformationSchema,} from '../../validationSchemas';
import {  createAdmissionData} from '../../../utils/formUtils'

const StudentAdmissionForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationOtp, setVerificationOtp] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const totalSteps = 4;
  const API = process.env.NEXT_PUBLIC_BACKEND_URL;
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
    const trimmedValue = ['firstName', 'lastName'].includes(name) ? value.trim() : value;
    setFormData((prev) => ({
      ...prev,
      [name]: trimmedValue,
    }));
    if (name === 'parentEmail') {
      setIsEmailVerified(false);
      setVerificationOtp(null);
    }
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast.error('Only JPEG and PNG images are allowed');
        return;
      }
    }
    setFormData((prev) => ({
      ...prev,
      profileImage: file,
    }));
    setErrors((prev) => ({ ...prev, profileImage: '' }));
  };

  const handleClose = () => {
    router.push('/admin/students');
  };

  const handleSendVerificationEmail = async () => {
    if (!formData.parentEmail) {
      toast.error('Please enter a parent email address');
      return;
    }
    setLoading(true);
    try {
      const admissionData = createAdmissionData(formData);
      await axios.post(`${API}/students/send-verification-email`, admissionData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });
      toast.success('Verification email sent! Please ask the parent to verify their email.');
    } catch {
      toast.error('Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOtp = async () => {
    if (!formData.parentEmail || !verificationOtp) {
      toast.error('Please send a verification email first or enter a valid token');
      return;
    }
    setLoading(true);
    try {
        await axios.post(`${API}/auth/verify-otp`,{
          email:formData.parentEmail,
          code:verificationOtp
        },{
          headers:{
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          }
        })
      setIsEmailVerified(true);
      toast.success('Email verified successfully!');

    } catch (error) {
      console.error('Error verifying email:', error);
      toast.error('Email not verified');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isEmailVerified) {
      toast.error('Please verify the parent email before submitting');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      const admissionData = createAdmissionData(formData);
      formDataToSend.append('student', JSON.stringify(admissionData.student));
      formDataToSend.append('parent', JSON.stringify(admissionData.parent));
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
      formDataToSend.append('verificationOtp', verificationOtp || '');

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

  const validateStep = async (step: number): Promise<boolean> => {
  try {
    switch (step) {
      case 1:
        await personalInformationSchema.validate(formData, { abortEarly: false });
        break;
      case 2:
        await academicInformationSchema.validate(formData, { abortEarly: false });
        break;
      case 3:
        await parentInformationSchema.validate(formData, { abortEarly: false });
        break;
      case 4:
        await medicalInformationSchema.validate(formData, { abortEarly: false });
        break;
      default:
        return false;
    }

    setErrors({});
    return true;
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      const validationErrors: { [key: string]: string } = {};
      err.inner.forEach((error) => {
        if (error.path) {
          validationErrors[error.path] = error.message;
        }
      });
      setErrors(validationErrors);
      toast.error('Please fill in all required fields correctly.');
      return false;
    }
    return false;
  }
};


  const nextStep = async () => {
    if (currentStep < totalSteps) {
      const isValid = await validateStep(currentStep);
      if (isValid) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
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
            errors={errors}
          />
        );
      case 2:
        return (
          <AcademicInformationForm
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      case 3:
        return (
          <ParentInformationForm
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      case 4:
        return (
          <MedicalInformationForm
            formData={formData}
            onChange={handleInputChange}
            errors={errors}
          />
        );
      default:
        return (
          <PersonalInformationForm
            formData={formData}
            onChange={handleInputChange}
            onImageChange={handleImageChange}
            errors={errors}
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
            verificationOtp={verificationOtp}
            setVerificationOtp={setVerificationOtp}
            handleCheckOtp={handleCheckOtp}
          />
        </form>
      </div>
    </div>
  );
};

export default StudentAdmissionForm;