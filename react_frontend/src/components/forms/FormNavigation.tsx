
import type React from "react"
import { useState } from "react"
import type { StudentFormData } from "../../types/student"
import { PreviewModal } from "./previewModal"

interface FormNavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => Promise<void>
  onSubmit: () => void
  onSendVerification: () => Promise<void>
  formData: StudentFormData
  loading: boolean
  isEmailVerified: boolean
  verificationOtp: string | null
  setVerificationOtp: (token: string | null) => void
  handleCheckOtp: () => Promise<void>
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
  const [showPreview, setShowPreview] = useState(false)

  const handleOpenPreview = () => {
    setShowPreview(true)
  }

  const handleClosePreview = () => {
    setShowPreview(false)
  }

  return (
    <>
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrevious}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            currentStep === 1
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gray-700 text-white hover:bg-gray-600"
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
              {loading ? "Validating..." : "Next"}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleOpenPreview}
                disabled={loading || !formData.parentEmail}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  loading || !formData.parentEmail
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-yellow-600 text-white hover:bg-yellow-700"
                }`}
              >
                Show Preview
              </button>

              <button
                type="button"
                onClick={onSubmit}
                disabled={loading || !isEmailVerified}
                className={`px-6 py-2 rounded-md font-medium transition-colors flex items-center gap-2 ${
                  loading || !isEmailVerified
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Application
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      <PreviewModal
        isOpen={showPreview}
        onClose={handleClosePreview}
        formData={formData}
        loading={loading}
        verificationOtp={verificationOtp}
        setVerificationOtp={setVerificationOtp}
        handleCheckOtp={handleCheckOtp}
        onSendVerification={onSendVerification}
      />
    </>
  )
}
