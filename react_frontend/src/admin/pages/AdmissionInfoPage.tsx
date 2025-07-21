

import { useState } from "react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog,  DialogContent,DialogDescription,  DialogHeader, DialogTitle, DialogTrigger,} from "../../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Textarea } from "../../components/ui/textarea"
import { Search,Eye, Check,  X,FileText, Download,  User,  Phone, Mail, MapPin, Calendar,GraduationCap, Clock} from "lucide-react"
import type { AdmissionFormData } from "../../types/admission.types"


// Mock data for demonstration
const mockAdmissions: AdmissionFormData[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    dob: "2010-05-15",
    address: "123 Main St, City",
    profilePicture: new File([], "profile.jpg"),
    bloodGroup: "A+",
    aadharDocument: new File([], "aadhar.pdf"),
    birthCertificate: new File([], "birth.pdf"),
    previousSchool: "ABC Elementary School",
    transferCertificate: new File([], "transfer.pdf"),
    medicalInformation: "No known allergies",
    parentName: "Jane Doe",
    relationToStudent: "Mother",
    email: "jane.doe@email.com",
    mobileNumber: "+1234567890",
    emergencyContactName: "Bob Doe",
    emergencyContactNumber: "+1234567891",
    parentOccupation: "Engineer",
    classApplied: "Grade 8",
    nationality: "Indian",
    state: "Maharashtra",
    pincode: "400001",
    status: "pending",
    submittedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Smith",
    dob: "2009-08-22",
    address: "456 Oak Ave, Town",
    profilePicture: new File([], "profile.jpg"),
    bloodGroup: "B+",
    aadharDocument: new File([], "aadhar.pdf"),
    birthCertificate: new File([], "birth.pdf"),
    previousSchool: "XYZ Public School",
    transferCertificate: new File([], "transfer.pdf"),
    medicalInformation: "Asthma - requires inhaler",
    parentName: "Mike Smith",
    relationToStudent: "Father",
    email: "mike.smith@email.com",
    mobileNumber: "+1234567892",
    emergencyContactName: "Lisa Smith",
    emergencyContactNumber: "+1234567893",
    parentOccupation: "Doctor",
    classApplied: "Grade 9",
    nationality: "Indian",
    state: "Karnataka",
    pincode: "560001",
    status: "approved",
    submittedAt: "2024-01-14T14:20:00Z",
  },
  {
    id: "3",
    firstName: "Raj",
    lastName: "Patel",
    dob: "2011-03-10",
    address: "789 Pine Rd, Village",
    profilePicture: new File([], "profile.jpg"),
    bloodGroup: "O+",
    aadharDocument: new File([], "aadhar.pdf"),
    birthCertificate: null,
    previousSchool: "DEF International School",
    transferCertificate: null,
    medicalInformation: "None",
    parentName: "Priya Patel",
    relationToStudent: "Mother",
    email: "priya.patel@email.com",
    mobileNumber: "+1234567894",
    emergencyContactName: "Amit Patel",
    emergencyContactNumber: "+1234567895",
    parentOccupation: "Business Owner",
    classApplied: "Grade 7",
    nationality: "Indian",
    state: "Gujarat",
    pincode: "380001",
    status: "refill_requested",
    submittedAt: "2024-01-13T09:15:00Z",
    rejectionReason:
      "Missing birth certificate and transfer certificate. Please upload these documents to proceed with the application.",
    refillRequestedAt: "2024-01-16T11:30:00Z",
  },
  {
    id: "4",
    firstName: "Anita",
    lastName: "Kumar",
    dob: "2010-12-05",
    address: "321 Elm St, District",
    profilePicture: new File([], "profile.jpg"),
    bloodGroup: "AB+",
    aadharDocument: new File([], "aadhar.pdf"),
    birthCertificate: new File([], "birth.pdf"),
    previousSchool: "GHI Public School",
    transferCertificate: new File([], "transfer.pdf"),
    medicalInformation: "Lactose intolerant",
    parentName: "Suresh Kumar",
    relationToStudent: "Father",
    email: "suresh.kumar@email.com",
    mobileNumber: "+1234567896",
    emergencyContactName: "Meera Kumar",
    emergencyContactNumber: "+1234567897",
    parentOccupation: "Teacher",
    classApplied: "Grade 8",
    nationality: "Indian",
    state: "Tamil Nadu",
    pincode: "600001",
    status: "rejected",
    submittedAt: "2024-01-12T16:45:00Z",
    rejectionReason: "Age criteria not met. Student must be between 12-14 years for Grade 8 admission.",
    verificationNotes:
      "Verified all documents. Age verification shows student is 13 years old, which exceeds our age limit for Grade 8.",
  },
]

export default function AdmissionInfoPage() {
  const [admissions, setAdmissions] = useState<AdmissionFormData[]>(mockAdmissions)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionFormData | null>(null)
  const [verificationNotes, setVerificationNotes] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [applicationToReject, setApplicationToReject] = useState<string | null>(null)
  const [documentPreview, setDocumentPreview] = useState<{ url: string; type: string; name: string } | null>(null)

  const filteredAdmissions = admissions.filter((admission) => {
    const matchesSearch =
      admission.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admission.classApplied.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || admission.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "refill_requested":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Refill Requested
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const handleStatusUpdate = (id: string, newStatus: "approved" | "rejected", notes?: string) => {
    setAdmissions((prev) =>
      prev.map((admission) =>
        admission.id === id ? { ...admission, status: newStatus, verificationNotes: notes } : admission,
      ),
    )
    setSelectedAdmission(null)
    setVerificationNotes("")
  }

  const handleRejectWithReason = (id: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a reason for rejection")
      return
    }

    setAdmissions((prev) =>
      prev.map((admission) =>
        admission.id === id
          ? {
              ...admission,
              status: "rejected",
              rejectionReason: rejectionReason,
              verificationNotes: verificationNotes,
            }
          : admission,
      ),
    )
    setShowRejectionDialog(false)
    setApplicationToReject(null)
    setRejectionReason("")
    setVerificationNotes("")
    setSelectedAdmission(null)
  }

  const handleRequestRefill = (id: string, reason: string) => {
    setAdmissions((prev) =>
      prev.map((admission) =>
        admission.id === id
          ? {
              ...admission,
              status: "refill_requested",
              rejectionReason: reason,
              refillRequestedAt: new Date().toISOString(),
              verificationNotes: verificationNotes,
            }
          : admission,
      ),
    )
    setShowRejectionDialog(false)
    setApplicationToReject(null)
    setRejectionReason("")
    setVerificationNotes("")
    setSelectedAdmission(null)
  }

  const handleViewDocument = (docType: string, fileName: string) => {
    // In a real application, this would fetch the actual document
    const mockDocUrl = `/placeholder.svg?height=600&width=800&text=${docType}`
    setDocumentPreview({
      url: mockDocUrl,
      type: docType,
      name: fileName,
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div>
          <h1 className="text-3xl font-bold">Admission Management</h1>
          <p className="text-muted-foreground">Review and manage student admission requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{admissions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {admissions.filter((a) => a.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Refill Requested</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {admissions.filter((a) => a.status === "refill_requested").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {admissions.filter((a) => a.status === "approved").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <X className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {admissions.filter((a) => a.status === "rejected").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refill_requested">Refill Requested</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admission Applications</CardTitle>
          <CardDescription>
            {filteredAdmissions.length} of {admissions.length} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Class Applied</TableHead>
                <TableHead>Parent Contact</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmissions.map((admission) => (
                <TableRow key={admission.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {admission.firstName} {admission.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">{admission.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{admission.classApplied}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{admission.parentName}</div>
                      <div className="text-sm text-muted-foreground">{admission.mobileNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(admission.submittedAt)}</TableCell>
                  <TableCell>{getStatusBadge(admission.status)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedAdmission(admission)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Admission Application Details</DialogTitle>
                          <DialogDescription>
                            Review and verify the admission application for {admission.firstName} {admission.lastName}
                          </DialogDescription>
                        </DialogHeader>

                        {selectedAdmission && (
                          <Tabs defaultValue="student" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                              <TabsTrigger value="student">Student Info</TabsTrigger>
                              <TabsTrigger value="parent">Parent Info</TabsTrigger>
                              <TabsTrigger value="documents">Documents</TabsTrigger>
                              <TabsTrigger value="verification">Verification</TabsTrigger>
                            </TabsList>

                            <TabsContent value="student" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    Full Name
                                  </Label>
                                  <p className="text-sm">
                                    {selectedAdmission.firstName} {selectedAdmission.lastName}
                                  </p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Date of Birth
                                  </Label>
                                  <p className="text-sm">{selectedAdmission.dob}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Blood Group</Label>
                                  <p className="text-sm">{selectedAdmission.bloodGroup}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Class Applied</Label>
                                  <p className="text-sm">{selectedAdmission.classApplied}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Nationality</Label>
                                  <p className="text-sm">{selectedAdmission.nationality}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Previous School</Label>
                                  <p className="text-sm">{selectedAdmission.previousSchool}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  Address
                                </Label>
                                <p className="text-sm">
                                  {selectedAdmission.address}, {selectedAdmission.state} - {selectedAdmission.pincode}
                                </p>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Medical Information</Label>
                                <p className="text-sm">{selectedAdmission.medicalInformation}</p>
                              </div>
                            </TabsContent>

                            <TabsContent value="parent" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Parent Name</Label>
                                  <p className="text-sm">{selectedAdmission.parentName}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Relation to Student</Label>
                                  <p className="text-sm">{selectedAdmission.relationToStudent}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium flex items-center">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email
                                  </Label>
                                  <p className="text-sm">{selectedAdmission.email}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium flex items-center">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Mobile Number
                                  </Label>
                                  <p className="text-sm">{selectedAdmission.mobileNumber}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Occupation</Label>
                                  <p className="text-sm">{selectedAdmission.parentOccupation}</p>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Emergency Contact</Label>
                                  <p className="text-sm">{selectedAdmission.emergencyContactName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {selectedAdmission.emergencyContactNumber}
                                  </p>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="documents" className="space-y-4">
                              <div className="grid grid-cols-1 gap-4">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center">
                                      <FileText className="h-5 w-5 mr-2" />
                                      Required Documents
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-3">
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                      <div>
                                        <p className="font-medium">Profile Picture</p>
                                        <p className="text-sm text-muted-foreground">Student photograph</p>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge variant={selectedAdmission.profilePicture ? "default" : "secondary"}>
                                          {selectedAdmission.profilePicture ? "Uploaded" : "Missing"}
                                        </Badge>
                                        {selectedAdmission.profilePicture && (
                                          <>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleViewDocument("Profile Picture", "profile.jpg")}
                                            >
                                              <Eye className="h-4 w-4 mr-1" />
                                              View
                                            </Button>
                                            <Button variant="outline" size="sm">
                                              <Download className="h-4 w-4" />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                      <div>
                                        <p className="font-medium">Aadhar Document</p>
                                        <p className="text-sm text-muted-foreground">Identity proof</p>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge variant={selectedAdmission.aadharDocument ? "default" : "secondary"}>
                                          {selectedAdmission.aadharDocument ? "Uploaded" : "Missing"}
                                        </Badge>
                                        {selectedAdmission.aadharDocument && (
                                          <>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleViewDocument("Aadhar Document", "aadhar.pdf")}
                                            >
                                              <Eye className="h-4 w-4 mr-1" />
                                              View
                                            </Button>
                                            <Button variant="outline" size="sm">
                                              <Download className="h-4 w-4" />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                      <div>
                                        <p className="font-medium">Birth Certificate</p>
                                        <p className="text-sm text-muted-foreground">Age verification</p>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge variant={selectedAdmission.birthCertificate ? "default" : "secondary"}>
                                          {selectedAdmission.birthCertificate ? "Uploaded" : "Missing"}
                                        </Badge>
                                        {selectedAdmission.birthCertificate && (
                                          <>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => handleViewDocument("Birth Certificate", "birth_cert.pdf")}
                                            >
                                              <Eye className="h-4 w-4 mr-1" />
                                              View
                                            </Button>
                                            <Button variant="outline" size="sm">
                                              <Download className="h-4 w-4" />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 border rounded-lg">
                                      <div>
                                        <p className="font-medium">Transfer Certificate</p>
                                        <p className="text-sm text-muted-foreground">Previous school records</p>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge
                                          variant={selectedAdmission.transferCertificate ? "default" : "secondary"}
                                        >
                                          {selectedAdmission.transferCertificate ? "Uploaded" : "Missing"}
                                        </Badge>
                                        {selectedAdmission.transferCertificate && (
                                          <>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                handleViewDocument("Transfer Certificate", "transfer_cert.pdf")
                                              }
                                            >
                                              <Eye className="h-4 w-4 mr-1" />
                                              View
                                            </Button>
                                            <Button variant="outline" size="sm">
                                              <Download className="h-4 w-4" />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </TabsContent>

                            <TabsContent value="verification" className="space-y-4">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium">Current Status</Label>
                                  <div className="mt-2">{getStatusBadge(selectedAdmission.status)}</div>
                                </div>

                                {selectedAdmission.rejectionReason && (
                                  <div>
                                    <Label className="text-sm font-medium">Rejection Reason</Label>
                                    <p className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                                      {selectedAdmission.rejectionReason}
                                    </p>
                                  </div>
                                )}

                                {selectedAdmission.verificationNotes && (
                                  <div>
                                    <Label className="text-sm font-medium">Verification Notes</Label>
                                    <p className="mt-2 p-3 bg-muted rounded-lg text-sm">
                                      {selectedAdmission.verificationNotes}
                                    </p>
                                  </div>
                                )}

                                {(selectedAdmission.status === "pending" ||
                                  selectedAdmission.status === "refill_requested") && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="notes" className="text-sm font-medium">
                                        Verification Notes (Optional)
                                      </Label>
                                      <Textarea
                                        id="notes"
                                        placeholder="Add any notes about the verification process..."
                                        value={verificationNotes}
                                        onChange={(e) => setVerificationNotes(e.target.value)}
                                        className="mt-2"
                                      />
                                    </div>

                                    <div className="flex space-x-2">
                                      <Button
                                        onClick={() =>
                                          handleStatusUpdate(selectedAdmission.id, "approved", verificationNotes)
                                        }
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <Check className="h-4 w-4 mr-2" />
                                        Approve Application
                                      </Button>
                                      <Button
                                        variant="destructive"
                                        onClick={() => {
                                          setApplicationToReject(selectedAdmission.id)
                                          setShowRejectionDialog(true)
                                        }}
                                      >
                                        <X className="h-4 w-4 mr-2" />
                                        Reject Application
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TabsContent>
                          </Tabs>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAdmissions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No admission applications found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this application. The applicant will receive this feedback.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason" className="text-sm font-medium">
                Rejection Reason *
              </Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please specify the reason for rejection (e.g., incomplete documents, eligibility criteria not met, etc.)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-2"
                required
              />
            </div>
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  onClick={() => applicationToReject && handleRejectWithReason(applicationToReject)}
                  disabled={!rejectionReason.trim()}
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject Application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => applicationToReject && handleRequestRefill(applicationToReject, rejectionReason)}
                  disabled={!rejectionReason.trim()}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Request Refill
                </Button>
              </div>
              <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Preview Dialog */}
      <Dialog open={!!documentPreview} onOpenChange={() => setDocumentPreview(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Document Preview: {documentPreview?.name}</DialogTitle>
            <DialogDescription>{documentPreview?.type}</DialogDescription>
          </DialogHeader>
          {documentPreview && (
            <div className="flex justify-center">
              <img
                src={documentPreview.url || "/placeholder.svg"}
                alt={documentPreview.name}
                className="max-w-full max-h-[70vh] object-contain border rounded-lg"
              />
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDocumentPreview(null)}>
              Close
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
