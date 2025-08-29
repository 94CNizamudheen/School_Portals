

import { useEffect, useState } from "react"
import { StatsCards } from "../components/Admission/stats.cards"
import StatusFilterWithSearch from "../../components/shared/filters"
import { ApplicationsTable } from "../components/Admission/application.table"
import { ApplicationDetailsDialog } from "../components/Admission/application.details.dialog"
import { DocumentViewer } from "../components/Admission/document.viewer"
import { RejectionDialog } from "../components/Admission/rejection.dialog"

import type { AdmissionFormData, DocumentPreview, } from "../../types/admission.types"
import { handleStatusChange } from "../../store/admissionThunks"
import { CustomPagination } from "../../components/shared/CustomPagination"

import { useNotification } from "../../context/notification/useNotification"
import { useAppDispatch, useAppSelector } from "../../hooks/app.hooks"


export default function AdmissionInfoPage() {


  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionFormData | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [documentPreview, setDocumentPreview] = useState<DocumentPreview | null>(null)

  const [verificationNotes, setVerificationNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [applicationToReject, setApplicationToReject] = useState<string | null>(null)
  const admissions = useAppSelector((state) => state.admissions.data);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7;
  const { showNotification } = useNotification()

  // useEffect(()=>{
  //   dispatch(fetchAdmissions())
  //   console.log("this render from the admission info page")
  // },[dispatch])

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
      setApproving(true);
      try {

        await dispatch(handleStatusChange({
          id: selectedAdmission._id,
          data: {
            status: 'approved',
            verificationNotes: verificationNotes || 'verified and approved, Please pay admission fee for completed procedure',
          }
        })).unwrap()
        setApproving(false);
        showNotification('success', { message: "Application Approved successfully" })
        handleCloseDetailsDialog()
      } catch (error) {
        showNotification('error', { message: error as string || 'failed to approve application' })
        setApproving(false);
      }

    }
  }

  const handleRejectClick = async () => {
    if (selectedAdmission) {
      setApplicationToReject(selectedAdmission._id)
      setShowRejectionDialog(true)
    }
  }

  const handleRejectWithReason = async () => {
    if (!rejectionReason.trim() || !applicationToReject) return
    setRejecting(true);
    try {
      await dispatch(handleStatusChange({
        id: applicationToReject,
        data: {
          status: 'rejected',
          verificationNotes: verificationNotes || 'verification rejected',
          rejectionReason: rejectionReason || 'Invalid details',
        }
      })).unwrap()
      setRejecting(false);
      showNotification('success', { message: "Application rejected successfully" })
      handleCloseRejectionDialog()
      handleCloseDetailsDialog()
    } catch (error) {
      showNotification('error', { message: error as string || 'failed to approve application' })
      setRejecting(false);
    }
  };

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
  const handleFilterChange = (value: string) => {
    setStatusFilter(value)
  }
  const handleSearchQuery = (value: string) => {
    setSearchTerm(value)
  }
  const filteredAdmissions = admissions.filter((a) => {
    const matchesStatus =
      statusFilter === "all" || a.status?.toLowerCase() === statusFilter.toLowerCase();

    const matchesSearch =
      a.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.mobileNumber?.includes(searchTerm);
    return matchesStatus && matchesSearch;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const paginatedAdmissions = filteredAdmissions.slice(indexOfFirst, indexOfLast);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);
  const stats = {
    total: admissions.length,
    pending: admissions.filter(a => a.status === 'pending').length,
    approved: admissions.filter(a => a.status === 'approved').length,
    rejected: admissions.filter(a => a.status === 'rejected').length,
    completed: admissions.filter(a => a.status === 'completed').length,
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <StatsCards stats={stats} />

        <StatusFilterWithSearch
          onFilterChange={handleFilterChange}
          onSearchChange={handleSearchQuery}
        />
      </div>

      <ApplicationsTable
        admissions={paginatedAdmissions}
        totalCount={admissions.length}
        onViewDetails={handleViewDetails}
      />


      <ApplicationDetailsDialog
        admission={selectedAdmission}
        isOpen={showDetailsDialog}
        verificationNotes={verificationNotes}
        onVerificationNotesChange={setVerificationNotes}
        onApprove={handleApprove}
        onReject={handleRejectClick}
        onViewDocument={handleViewDocument}
        onClose={handleCloseDetailsDialog}
        approving={approving}
        rejecting={rejecting}
      />

      <RejectionDialog
        isOpen={showRejectionDialog}
        rejectionReason={rejectionReason}
        onReasonChange={setRejectionReason}
        onReject={handleRejectWithReason}
        onClose={handleCloseRejectionDialog}
      />
      <CustomPagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredAdmissions.length / itemsPerPage)}
        onPageChange={(page) => setCurrentPage(page)}
      />
      <DocumentViewer document={documentPreview} onClose={() => setDocumentPreview(null)} />
    </div>
  )
}

