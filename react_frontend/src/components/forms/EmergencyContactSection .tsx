import { Phone } from "lucide-react";
import FormField from "./FormField";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import type { AdmissionFormData, AdmissionFormErrors, HandleInputChange } from "@/types/admission.types";

interface EmergencyContactProps{
 formData:AdmissionFormData;
 handleInputChange:HandleInputChange;
 errors:AdmissionFormErrors
}


const EmergencyContactSection:React.FC<EmergencyContactProps> = ({ formData, handleInputChange, errors }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Emergency Contact
        </CardTitle>
        <CardDescription className="text-red-100">
          Emergency contact information
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            name="emergencyContactName"
            label="Emergency Contact Name"
            required
            placeholder="Enter emergency contact name"
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          />
          <FormField
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            required
            placeholder="Enter 10-digit contact number"
            errors={errors}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
export default EmergencyContactSection