import { useEffect, useState } from "react"

import type { AdmissionFormData } from "../types/admission.types"
import { FileText, AlertCircle } from "lucide-react"
import { completeAdmissionPayment, fetchApplicationsByEmail } from "../store/admissionThunks"
import ApplicationCard from "../components/ApplicationCard"
import { AxiosError } from "axios"
import ComponentLoader from "../components/shared/ComponentLoader"
import { useNavigate } from "react-router-dom"
import { useNotification } from "../context/notification/useNotification"
import { useAppDispatch, useAppSelector } from "../hooks/app.hooks"

interface StatusCounts {
  total: number
  pending: number
  approved: number
  rejected: number
  completed: number
}

const MyApplications: React.FC = () => {
  const navigate = useNavigate()
  const [expandedApplications, setExpandedApplications] = useState<Set<string>>(new Set())
  const [paymentInProgressId, setPaymentInProgressId] = useState<string | null>(null)

  const { isAuthenticated, userEmail } = useAppSelector((state ) => state.auth)
  const { applicationsByEmail, loading, error } = useAppSelector((state ) => state.admissions)
  const { showNotification } = useNotification()
const dispatch = useAppDispatch()

  useEffect(() => {
    if (isAuthenticated && userEmail) {
      dispatch(fetchApplicationsByEmail(userEmail))
    }
  }, [isAuthenticated, userEmail, dispatch])
  

  const handlePayment = async (id: string) => {
    setPaymentInProgressId(id)
    try {
      const amount = 1000
      const transactionId = "sample_transaction_" + Date.now()

      await dispatch(completeAdmissionPayment({ admissionId: id, amount, transactionId })).unwrap()

      showNotification("success", { title: "Payment", message: "Payment Successful ✅" })

      if (userEmail) {
        dispatch(fetchApplicationsByEmail(userEmail))
      }
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      console.error("Payment failed:", err)
      showNotification("error", { title: "Payment", message: "Payment Failed ❌" })
    } finally {
      setPaymentInProgressId(null)
    }
  }

  // Expand / Collapse Application Card
  const toggleApplicationExpansion = (applicationId: string): void => {
    const newExpanded = new Set(expandedApplications)
    if (newExpanded.has(applicationId)) {
      newExpanded.delete(applicationId)
    } else {
      newExpanded.add(applicationId)
    }
    setExpandedApplications(newExpanded)
  }

  // Status Count
  const getStatusCounts = (): StatusCounts => {
    return {
      total: applicationsByEmail.length,
      pending: applicationsByEmail.filter((app) => app.status === "pending").length,
      approved: applicationsByEmail.filter((app) => app.status === "approved").length,
      rejected: applicationsByEmail.filter((app) => app.status === "rejected").length,
      completed: applicationsByEmail.filter((app) => app.status === "completed").length,
    }
  }

  // Loading State
  if (loading) return <ComponentLoader />

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Applications</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Empty State
  if (!applicationsByEmail.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Applications Found</h2>
            <p className="text-gray-600 mb-6">You haven't submitted any admission applications yet.</p>

            <button
              onClick={() => navigate("/admission")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
            >
              Apply for Admission
            </button>
          </div>
        </div>
      </div>
    )
  }

  const statusCounts = getStatusCounts()

  // Main UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-purple-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track the status of your admission applications</p>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-400">
            <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-4 shadow-sm border border-yellow-400">
            <div className="text-2xl font-bold text-yellow-700">{statusCounts.pending}</div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-blue-200 rounded-xl p-4 shadow-sm border border-blue-400">
            <div className="text-2xl font-bold text-blue-700">{statusCounts.approved}</div>
            <div className="text-sm text-blue-600">Approved</div>
          </div>
          <div className="bg-red-50 rounded-xl p-4 shadow-sm border border-red-400">
            <div className="text-2xl font-bold text-red-700">{statusCounts.rejected}</div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
          <div className="bg-green-200 rounded-xl p-4 shadow-sm border border-green-400">
            <div className="text-2xl font-bold text-green-800">{statusCounts.completed}</div>
            <div className="text-sm text-green-800">Completed</div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-6">
          {applicationsByEmail.map((application: AdmissionFormData) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onPayment={handlePayment}
              isExpanded={expandedApplications.has(application._id)}
              onToggle={() => toggleApplicationExpansion(application._id)}
              isPaymentLoading={paymentInProgressId === application._id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default MyApplications
