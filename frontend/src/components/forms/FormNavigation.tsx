// components/forms/FormNavigation.tsx
import React, { useState } from 'react';
import { StudentFormData } from '@/types/student';
import Image from 'next/image';
// import { createAdmissionData } from '@/app/utils/formUtils';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => Promise<void>;
  onSubmit: () => void;
  onSendVerification: () => Promise<void>;
  formData: StudentFormData;
  loading: boolean;
  isEmailVerified: boolean;
  verificationOtp: string | null;
  setVerificationOtp: (token: string | null) => void;
  handleCheckOtp: () => Promise<void>;
}

export const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  onSendVerification,
  formData,
  loading,
  isEmailVerified,
  verificationOtp,
  setVerificationOtp,
  handleCheckOtp,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const handlePreviewAndVerify = async () => {
    // const admissionData = createAdmissionData(formData);
    setShowPreview(true);
    await onSendVerification();
  };

  return (
    <div className="flex justify-between mt-8">
      <button
        type="button"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`px-6 py-2 rounded-md font-medium transition-colors ${
          currentStep === 1
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gray-700 text-white hover:bg-gray-600'
        }`}
      >
        Previous
      </button>

      <div className="flex space-x-4">
        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Validating...' : 'Next'}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handlePreviewAndVerify}
              disabled={loading || !formData.parentEmail}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                loading || !formData.parentEmail
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-600 text-white hover:bg-yellow-700'
              }`}
            >
              {loading ? 'Sending...' : 'Preview Application and Verify Details'}
            </button>
            <button
              type="button"
              onClick={onSubmit}
              disabled={loading || !isEmailVerified}
              className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                loading || !isEmailVerified
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </>
        )}
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">Application Preview</h3>
            <div className="space-y-4 text-white">
              <h4 className="text-md font-semibold">Student Information</h4>
              <p>
                <strong>Name:</strong> {formData.firstName} {formData.lastName}
              </p>
              <p>
                <strong>Email:</strong> {formData.email}
              </p>
              <p>
                <strong>Phone:</strong> {formData.phone}
              </p>
              <p>
                <strong>Date of Birth:</strong> {formData.dateOfBirth || 'Not provided'}
              </p>
              <p>
                <strong>Gender:</strong> {formData.gender || 'Not provided'}
              </p>
              <p>
                <strong>Grade:</strong> {formData.grade || 'Not provided'}
              </p>
              <p>
                <strong>Class:</strong> {formData.class || 'Not provided'}
              </p>
              <p>
                <strong>Roll Number:</strong> {formData.rollNumber || 'Not provided'}
              </p>
              <p>
                <strong>Address:</strong> {formData.address || 'Not provided'},{' '}
                {formData.city || ''}, {formData.state || ''}, {formData.pincode || ''}
              </p>
              {formData.profileImage && (
                <div>
                  <p>
                    <strong>Profile Image:</strong>
                  </p>
                  <Image
                    src={URL.createObjectURL(formData.profileImage)}
                    alt="Profile Preview"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                </div>
              )}
              <h4 className="text-md font-semibold mt-4">Parent Information</h4>
              <p>
                <strong>Name:</strong> {formData.parentName}
              </p>
              <p>
                <strong>Email:</strong> {formData.parentEmail}
              </p>
              <p>
                <strong>Phone:</strong> {formData.parentPhone}
              </p>
              <p>
                <strong>Relationship:</strong> {formData.relationship || 'Not provided'}
              </p>
              <h4 className="text-md font-semibold mt-4">Medical Information</h4>
              <p>
                <strong>Medical Conditions:</strong> {formData.medicalConditions || 'Not provided'}
              </p>
              <p>
                <strong>Allergies:</strong> {formData.allergies || 'Not provided'}
              </p>
              <p>
                <strong>Medications:</strong> {formData.medications || 'Not provided'}
              </p>
            </div>
            <p className="text-gray-400 mt-4">
              A verification email has been sent to {formData.parentEmail}. Please ask the parent
              to verify their email, or enter the verification token below.
            </p>
            <div className="mt-4">
              <label htmlFor="otp" className="text-white">
                Enter OTP:
              </label>
              <input
                id="otp"
                type="text"
                value={verificationOtp || ''}
                onChange={(e) => setVerificationOtp(e.target.value)}
                className="mt-1 p-2 w-full bg-gray-700 text-white rounded-md"
              />
              <button
                type="button"
                onClick={handleCheckOtp}
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={loading}
              >
                Verify OTP
              </button>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};