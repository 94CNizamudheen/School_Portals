import { FileText } from "lucide-react";
import FileUpload from "./FileUpload";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { HandleFileChange,AdmissionFormData,AdmissionFormErrors } from "../../types/admission.types";
import type React from "react";

interface DocumentSectionProps{
 formData:AdmissionFormData;
 handleFileChange:HandleFileChange;
 errors:AdmissionFormErrors
}

const DocumentsSection:React.FC<DocumentSectionProps> = ({ formData, handleFileChange, errors }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Document Uploads
        </CardTitle>
        <CardDescription className="text-green-100">
          Please upload the required documents
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FileUpload
            name="profilePicture"
            label="Profile Picture"
            required
            accept="image/*"
            formData={formData}
            handleFileChange={handleFileChange}
            errors={errors}
          />
          <FileUpload
            name="aadharDocument"
            label="Aadhar Card"
            required
            accept=".pdf,.jpg,.jpeg,.png"
            formData={formData}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FileUpload
            name="birthCertificate"
            label="Birth Certificate"
            required
            accept=".pdf,.jpg,.jpeg,.png"
            formData={formData}
            handleFileChange={handleFileChange}
            errors={errors}
          />
          <FileUpload
            name="transferCertificate"
            label="Transfer Certificate"
            accept=".pdf,.jpg,.jpeg,.png"
            formData={formData}
            handleFileChange={handleFileChange}
            errors={errors}
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default DocumentsSection