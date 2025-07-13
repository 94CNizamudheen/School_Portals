

import type React from "react"
import { useState } from "react"
import type { StudentFormData } from "../../types/student"

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  formData: StudentFormData
  loading: boolean
  verificationOtp: string | null
  setVerificationOtp: (token: string | null) => void
  handleCheckOtp: () => Promise<void>
  onSendVerification: () => Promise<void>
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  formData,
  loading,
  verificationOtp,
  setVerificationOtp,
  handleCheckOtp,
  onSendVerification,
}) => {
  const [otpSent, setOtpSent] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)

  const handleSendOtp = async () => {
    setSendingOtp(true)
    try {
      await onSendVerification()
      setOtpSent(true)
    } catch (error) {
      console.error("Failed to send OTP:", error)
    } finally {
      setSendingOtp(false)
    }
  }

  const handleOtpVerification = async () => {
    try {
      await handleCheckOtp()
      setIsOtpVerified(true)
      setTimeout(() => {
        onClose()
      }, 1200)
    } catch (error) {
      console.error("OTP verification failed", error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Application Preview</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6 text-white">
          <div>
            <h4 className="text-md font-semibold text-blue-400 mb-3 border-b border-gray-600 pb-2">Student Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Name:</span><span className="ml-2">{formData.firstName} {formData.lastName}</span></div>
              <div><span className="text-gray-400">Email:</span><span className="ml-2">{formData.email}</span></div>
              <div><span className="text-gray-400">Phone:</span><span className="ml-2">{formData.phone}</span></div>
              <div><span className="text-gray-400">Date of Birth:</span><span className="ml-2">{formData.dateOfBirth || "Not provided"}</span></div>
              <div><span className="text-gray-400">Gender:</span><span className="ml-2">{formData.gender || "Not provided"}</span></div>
              <div><span className="text-gray-400">Blood Group:</span><span className="ml-2">{formData.bloodGroup || "Not provided"}</span></div>
              <div><span className="text-gray-400">Grade:</span><span className="ml-2">{formData.grade || "Not provided"}</span></div>
              <div><span className="text-gray-400">Class:</span><span className="ml-2">{formData.class || "Not provided"}</span></div>
              <div><span className="text-gray-400">Roll Number:</span><span className="ml-2">{formData.rollNumber || "Not provided"}</span></div>
              <div className="md:col-span-2">
                <span className="text-gray-400">Address:</span>
                <span className="ml-2">{[formData.address, formData.city, formData.state, formData.pincode].filter(Boolean).join(", ") || "Not provided"}</span>
              </div>
            </div>
            {formData.profileImage && (
              <div className="mt-4">
                <span className="text-gray-400 block mb-2">Profile Image:</span>
                <img
                  src={URL.createObjectURL(formData.profileImage)}
                  alt="Profile Preview"
                  width={80}
                  height={80}
                  className="rounded-full border-2 border-gray-600"
                />
              </div>
            )}
          </div>

          <div>
            <h4 className="text-md font-semibold text-green-400 mb-3 border-b border-gray-600 pb-2">Parent Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Name:</span><span className="ml-2">{formData.parentName}</span></div>
              <div><span className="text-gray-400">Email:</span><span className="ml-2">{formData.parentEmail}</span></div>
              <div><span className="text-gray-400">Phone:</span><span className="ml-2">{formData.parentPhone}</span></div>
              <div><span className="text-gray-400">Relationship:</span><span className="ml-2">{formData.relationship || "Not provided"}</span></div>
              <div><span className="text-gray-400">Occupation:</span><span className="ml-2">{formData.parentOccupation || "Not provided"}</span></div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-yellow-400 mb-3 border-b border-gray-600 pb-2">Emergency Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-400">Name:</span><span className="ml-2">{formData.emergencyContactName || "Not provided"}</span></div>
              <div><span className="text-gray-400">Phone:</span><span className="ml-2">{formData.emergencyContactPhone || "Not provided"}</span></div>
              <div><span className="text-gray-400">Relationship:</span><span className="ml-2">{formData.emergencyContactRelationship || "Not provided"}</span></div>
            </div>
          </div>

          <div>
            <h4 className="text-md font-semibold text-red-400 mb-3 border-b border-gray-600 pb-2">Medical Information</h4>
            <div className="space-y-3 text-sm">
              <div><span className="text-gray-400 block">Medical Conditions:</span><span className="ml-2">{formData.medicalConditions || "None reported"}</span></div>
              <div><span className="text-gray-400 block">Allergies:</span><span className="ml-2">{formData.allergies || "None reported"}</span></div>
              <div><span className="text-gray-400 block">Medications:</span><span className="ml-2">{formData.medications || "None reported"}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
          {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={sendingOtp}
              className={`w-full px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${sendingOtp
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
            >
              {sendingOtp ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP to Parent Email"
              )}
            </button>
          ) : (
            <>
              <p className="text-gray-300 mb-4">
                OTP sent to <span className="text-blue-400 font-medium">{formData.parentEmail}</span>. Please enter it below to verify.
              </p>

              <div className="space-y-3">
                <div>
                  <label htmlFor="otp" className="block text-white text-sm font-medium mb-1">Enter OTP:</label>
                  <input
                    id="otp"
                    type="text"
                    value={verificationOtp || ""}
                    onChange={(e) => setVerificationOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    className="w-full p-3 bg-gray-600 text-white rounded-md border border-gray-500 focus:border-blue-500 focus:outline-none transition-colors"
                    maxLength={6}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleOtpVerification}
                  disabled={loading || !verificationOtp}
                  className={`w-full px-4 py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${loading || !verificationOtp
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </button>

                {/* Resend OTP button */}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={sendingOtp}
                  className={`w-full px-4 py-2 text-sm rounded-md mt-2 transition-colors ${sendingOtp
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-yellow-600 text-white hover:bg-yellow-700"
                    }`}
                >
                  {sendingOtp ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Resending OTP...
                    </>
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </div>

              {isOtpVerified && (
                <p className="text-green-400 text-sm font-medium mt-3">✅ OTP Verified! Closing preview...</p>
              )}
            </>

          )}
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t border-gray-600">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  )
}