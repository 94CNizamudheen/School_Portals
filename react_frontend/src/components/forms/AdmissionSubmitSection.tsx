import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import type { AdmissionFormErrors } from "@/types/admission.types";

interface AdmissionSubmitSectionProps {
  isSubmitting: boolean;
  handleSubmit: () => void;
  errors:AdmissionFormErrors
}

const AdmissionSubmitSection: React.FC<AdmissionSubmitSectionProps> = ({ isSubmitting, handleSubmit, errors }) => {
  const hasErrors = Object.values(errors).some((err) => !!err);

  return (
    <Card className="shadow-lg p-0">
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <Alert className="w-full bg-yellow-200">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-blue-700">
              Please review all information carefully before submitting. Fields marked with * are required.
            </AlertDescription>
          </Alert>

          {hasErrors && (
            <Alert className="w-full bg-red-100 border-red-400">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Please correct the highlighted errors above before submitting the form.
              </AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleSubmit}
            size="lg"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-3 text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              "Submit Admission Form"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};



export default AdmissionSubmitSection