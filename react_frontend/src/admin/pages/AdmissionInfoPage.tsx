

import { useState } from "react"
import { StatsCards } from "../components/Admission/stats.cards"
import { Filters } from "../components/Admission/filters"
import { ApplicationsTable } from "../components/Admission/application.table"
import { ApplicationDetailsDialog } from "../components/Admission/application.details.dialog"
import { DocumentViewer } from "../components/Admission/document.viewer"
import { RejectionDialog } from "../components/Admission/rejection.dialog"
import { useAdmissionData } from "../../hooks/useAdmissionData"
import { getStatusCounts, filterAdmissions } from "../../utils/admission.utils"
import type { AdmissionFormData, DocumentPreview, } from "../../types/admission.types"
import { handleStatusChange } from "../../store/admissionThunks"
import { toast } from "react-toastify"
import type { AxiosError } from "axios"
import { Pagination } from "../../components/shared/Pagination"


export default function AdmissionInfoPage() {


  const { admissions, updateAdmissionStatus } = useAdmissionData()
  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Dialog states
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionFormData | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [documentPreview, setDocumentPreview] = useState<DocumentPreview | null>(null)

  // Form states
  const [verificationNotes, setVerificationNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [applicationToReject, setApplicationToReject] = useState<string | null>(null)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10;


  const filteredAdmissions = filterAdmissions(admissions, searchTerm, statusFilter)
  const paginatedAdmissions = filteredAdmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const stats = getStatusCounts(admissions)


  const handleViewDetails = (admission: AdmissionFormData) => {
    setSelectedAdmission(admission)
    setShowDetailsDialog(true)
  }

  const handleCloseDetailsDialog = () => {
    setShowDetailsDialog(false)
    setSelectedAdmission(null)
    setVerificationNotes("")
  }

  const handleApprove = async () => {
    if (selectedAdmission) {
      try {
        await handleStatusChange(selectedAdmission._id, {
          status: 'approved',
          verificationNotes: verificationNotes || 'verified and approved, Please pay admission fee for completed procedure',
        })
        updateAdmissionStatus(selectedAdmission._id, "approved", verificationNotes)
        handleCloseDetailsDialog()
      } catch (error) {
        const err = error as AxiosError<{ message: string }>
        toast.error(err.response?.data.message || 'failed to approve application')
      }

    }
  }

  const handleRejectClick = async () => {
    if (selectedAdmission) {
      try {
        await handleStatusChange(selectedAdmission._id, {
          status: 'rejected',
          verificationNotes: verificationNotes || 'verification  rejected',
          rejectionReason: rejectionReason || 'Invalid details'
        })
        updateAdmissionStatus(selectedAdmission._id, "rejected", verificationNotes, rejectionReason)
        handleCloseDetailsDialog()
      } catch (error) {
        const err = error as AxiosError<{ message: string }>
        toast.error(err.response?.data.message || 'failed to reject application')
      }
      setApplicationToReject(selectedAdmission._id)
      setShowRejectionDialog(true)
    }
  }

  const handleRejectWithReason = () => {
    if (!rejectionReason.trim() || !applicationToReject) return

    updateAdmissionStatus(applicationToReject, "rejected", verificationNotes, rejectionReason)
    handleCloseRejectionDialog()
    handleCloseDetailsDialog()
  }

  const handleRequestRefill = () => {
    if (!rejectionReason.trim() || !applicationToReject) return

    updateAdmissionStatus(applicationToReject, "refill_requested", verificationNotes, rejectionReason)
    handleCloseRejectionDialog()
    handleCloseDetailsDialog()
  }

  const handleCloseRejectionDialog = () => {
    setShowRejectionDialog(false)
    setApplicationToReject(null)
    setRejectionReason("")
  }

  const handleViewDocument = (docType: string, fileUrl: string, fileName: string) => {
    setDocumentPreview({
      url: fileUrl,
      type: docType,
      name: fileName,
    });
  };


  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        {/* <div>
          <h1 className="text-3xl font-bold">Admission Management</h1>
          <p className="text-muted-foreground">Review and manage student admission requests</p>
        </div> */}

        <StatsCards stats={stats} />

        <Filters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />
      </div>

      <ApplicationsTable
        admissions={paginatedAdmissions}
        totalCount={admissions.length}
        onViewDetails={handleViewDetails}
      />
      {filteredAdmissions.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredAdmissions.length / itemsPerPage)}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}

      <ApplicationDetailsDialog
        admission={selectedAdmission}
        isOpen={showDetailsDialog}
        verificationNotes={verificationNotes}
        onVerificationNotesChange={setVerificationNotes}
        onApprove={handleApprove}
        onReject={handleRejectClick}
        onViewDocument={handleViewDocument}
        onClose={handleCloseDetailsDialog}
      />

      <RejectionDialog
        isOpen={showRejectionDialog}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onReject={handleRejectWithReason}
        onRequestRefill={handleRequestRefill}
        onClose={handleCloseRejectionDialog}
      />

      <DocumentViewer document={documentPreview} onClose={() => setDocumentPreview(null)} />
    </div>
  )
}

