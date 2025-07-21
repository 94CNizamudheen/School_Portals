export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const getStatusCounts = (admissions: any[]) => {
  return {
    total: admissions.length,
    pending: admissions.filter((a) => a.status === "pending").length,
    refillRequested: admissions.filter((a) => a.status === "refill_requested").length,
    approved: admissions.filter((a) => a.status === "approved").length,
    rejected: admissions.filter((a) => a.status === "rejected").length,
  }
}

export const filterAdmissions = (admissions: any[], searchTerm: string, statusFilter: string) => {
  return admissions.filter((admission) => {
    const matchesSearch =
      admission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.classApplied.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || admission.status === statusFilter

    return matchesSearch && matchesStatus
  })
}
