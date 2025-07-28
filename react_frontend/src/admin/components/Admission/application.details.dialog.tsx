
import { Button } from "../../../components/ui/button"
import { Badge } from "../../../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Textarea } from "../../../components/ui/textarea"
import { User, Phone, Mail, MapPin, Calendar, FileText, Eye, Download, Check, X } from "lucide-react"
import { StatusBadge } from "./stats.badge"
import type { AdmissionFormData } from "../../../types/admission.types"

interface ApplicationDetailsDialogProps {
  admission: AdmissionFormData | null
  isOpen: boolean
  verificationNotes: string
  onVerificationNotesChange: (notes: string) => void
  onApprove: () => void
  onReject: () => void
  onViewDocument: (docType: string, fileUrl: string, fileName: string) => void
  onClose: () => void
}
const getFileType = (url: string) => {
  if (url.endsWith(".pdf")) return "pdf";
  return "image";
};

export function ApplicationDetailsDialog({
  admission,
  isOpen,
  verificationNotes,
  onVerificationNotesChange,
  onApprove,
  onReject,
  onViewDocument,
  onClose,
}: ApplicationDetailsDialogProps) {
  if (!admission) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Admission Application Details</DialogTitle>
          <DialogDescription>
            Review and verify the admission application for {admission.firstName} {admission.lastName}
          </DialogDescription>
        </DialogHeader>

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
                  {admission.firstName} {admission.lastName}
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date of Birth
                </Label>
                <p className="text-sm">{admission.dob}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Blood Group</Label>
                <p className="text-sm">{admission.bloodGroup}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Class Applied</Label>
                <p className="text-sm">{admission.classApplied}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nationality</Label>
                <p className="text-sm">{admission.nationality}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Previous School</Label>
                <p className="text-sm">{admission.previousSchool}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Address
              </Label>
              <p className="text-sm">
                {admission.address}, {admission.state} - {admission.pincode}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Medical Information</Label>
              <p className="text-sm">{admission.medicalInformation}</p>
            </div>
          </TabsContent>

          <TabsContent value="parent" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Parent Name</Label>
                <p className="text-sm">{admission.parentName}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Relation to Student</Label>
                <p className="text-sm">{admission.relationToStudent}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Label>
                <p className="text-sm">{admission.email}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Mobile Number
                </Label>
                <p className="text-sm">{admission.mobileNumber}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Occupation</Label>
                <p className="text-sm">{admission.parentOccupation}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Emergency Contact</Label>
                <p className="text-sm">{admission.emergencyContactName}</p>
                <p className="text-xs text-muted-foreground">{admission.emergencyContactNumber}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  {
                    key: "profilePicture",
                    name: "Profile Picture",
                    desc: "Student photograph",
                    fileName: "profile.jpg",
                  },
                  { key: "aadharDocument", name: "Aadhar Document", desc: "Identity proof", fileName: "aadhar.pdf" },
                  {
                    key: "birthCertificate",
                    name: "Birth Certificate",
                    desc: "Age verification",
                    fileName: "birth_cert.pdf",
                  },
                  {
                    key: "transferCertificate",
                    name: "Transfer Certificate",
                    desc: "Previous school records",
                    fileName: "transfer_cert.pdf",
                  },
                ].map((doc) => (
                  <div key={doc.key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.desc}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={admission[doc.key as keyof AdmissionFormData] ? "default" : "secondary"}>
                        {admission[doc.key as keyof AdmissionFormData] ? "Uploaded" : "Missing"}
                      </Badge>
                      {admission[doc.key as keyof AdmissionFormData] && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => onViewDocument(
                            getFileType(admission[doc.key as keyof AdmissionFormData] as string),
                            admission[doc.key as keyof AdmissionFormData] as string,
                            doc.fileName
                          )}>
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
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Current Status</Label>
                <div className="mt-2">
                  <StatusBadge status={admission.status} />
                </div>
              </div>

              {admission.rejectionReason && (
                <div>
                  <Label className="text-sm font-medium">Rejection Reason</Label>
                  <p className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    {admission.rejectionReason}
                  </p>
                </div>
              )}

              {admission.verificationNotes && (
                <div>
                  <Label className="text-sm font-medium">Verification Notes</Label>
                  <p className="mt-2 p-3 bg-muted rounded-lg text-sm">{admission.verificationNotes}</p>
                </div>
              )}

              {(admission.status === "pending" ) && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium">
                      Verification Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes about the verification process..."
                      value={verificationNotes}
                      onChange={(e) => onVerificationNotesChange(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={onApprove} className="bg-green-600 hover:bg-green-700">
                      <Check className="h-4 w-4 mr-2" />
                      Approve Application
                    </Button>
                    <Button variant="destructive" onClick={onReject}>
                      <X className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
