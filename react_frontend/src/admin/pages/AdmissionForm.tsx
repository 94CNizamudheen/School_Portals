
import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { FormHeader } from "../../components/forms/AdmissionFormHeader";
import { ProgressBar } from "../../components/forms/ProgressBar";
import { FormNavigation } from "../../components/forms/FormNavigation";
import { PersonalInformationForm } from "../../components/forms/PersonalInformationForm";
import { AcademicInformationForm } from "../../components/forms/AcademicInformation";
import { MedicalInformationForm } from "../../components/forms/MedicalInformationForm";
import { ParentInformationForm } from "../../components/forms/ParentInformationForm";

import * as Yup from "yup";
import { personalInformationSchema,academicInformationSchema, parentInformationSchema,medicalInformationSchema,} from "../../utils/validationSchemas";
import {sendVerificationEmail as sendEmailThunk, verifyOtp as verifyOtpThunk, submitAdmission as submitAdmissionThunk} from "../../store/studentSlice";
import { useDispatch } from "react-redux";
import type { StudentFormData } from "../../types/student";
import type { AppDispatch } from "../../store/store";

const StudentAdmissionForm: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationOtp, setVerificationOtp] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const totalSteps = 4;
  const dispatch= useDispatch<AppDispatch>()
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
    nationality: "",
    religion: "",
    grade: "",
    class: "",
    rollNumber: "",
    previousSchool: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    parentOccupation: "",
    relationship: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelationship: "",
    medicalConditions: "",
    allergies: "",
    medications: "",
    profileImage: null,
  });

  const handleInputChange = (e: React.ChangeEvent< HTMLInputElement|HTMLSelectElement | HTMLTextAreaElement >) => {
    const { name, value } = e.target;
    const trimmedValue = ["firstName", "lastName"].includes(name)
      ? value.trim()
      : value;

    setFormData((prev) => ({ ...prev, [name]: trimmedValue }));

    if (name === "parentEmail") {
      setIsEmailVerified(false);
      setVerificationOtp(null);
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        toast.error("Only JPEG and PNG images are allowed");
        return;
      }
    }

    setFormData((prev) => ({ ...prev, profileImage: file }));
    setErrors((prev) => ({ ...prev, profileImage: "" }));
  };

  const handleClose = () => {
    navigate("/admin/students");
  };

const handleSendVerificationEmail = async () => {
  if (!formData.parentEmail) {
    toast.error("Please enter a parent email address");
    return;
  }

  setLoading(true);
  const resultAction = await dispatch(sendEmailThunk(formData));
  if (sendEmailThunk.fulfilled.match(resultAction)) {
    toast.success("Verification email sent! Please ask the parent to verify.");
  } else {
    toast.error(resultAction.payload as string|| "Failed to send verification email");
  }
  setLoading(false);
};

const handleCheckOtp = async () => {
  if (!formData.parentEmail || !verificationOtp) {
    toast.error("Please send a verification email first or enter a valid token");
    return;
  }

  setLoading(true);
  const resultAction = await dispatch(verifyOtpThunk({ email: formData.parentEmail, code: verificationOtp }));
  if (verifyOtpThunk.fulfilled.match(resultAction)) {
    setIsEmailVerified(true);
    toast.success("Email verified successfully!");
  } else {
    toast.error(resultAction.payload as string || "Verification failed");
  }
  setLoading(false);
};

const handleSubmit = async () => {
  if (!isEmailVerified) {
    toast.error("Please verify the parent email before submitting");
    return;
  }

  setLoading(true);
  const resultAction = await dispatch(submitAdmissionThunk({ formData, verificationOtp }));
  if (submitAdmissionThunk.fulfilled.match(resultAction)) {
    toast.success("Application submitted successfully!");
    navigate("/admin/students");
  } else {
    toast.error(resultAction.payload as string || "Submission failed");
  }
  setLoading(false);
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
        toast.error("Please fill in all required fields correctly.");
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
        return null;
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
