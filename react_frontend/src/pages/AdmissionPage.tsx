import { useEffect } from "react";
import AdmissionFormHeader from "../components/forms/AdmissionFormHeader";
import AdmissionSubmitSection from "../components/forms/AdmissionSubmitSection";
import DocumentsSection from "../components/forms/DocumentSection";
import EmergencyContactSection from "../components/forms/EmergencyContactSection ";
import ParentInformationSection from "../components/forms/ParentInformationSection ";
import StudentInformationSection from "../components/forms/StudentInformationSection";
import useAdmissionForm from "../components/forms/useAdmissionForm";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";




const AdmissionPage: React.FC = () => {

  const { formData, errors, isSubmitting, handleInputChange, handleFileChange, handleSubmit } = useAdmissionForm();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isAuthenticated) {
      toast.info('Please login for  admission')
      navigate('/guest/login');
    }
  }, [isAuthenticated, navigate])

  return (
    <div className=" min-h-screen bg-gradient-to-br from-purple-300 to-purple-950 py-8 px-4">
      <div className="w-[70%] max-w-4xl mx-auto bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl p-8 shadow-xl">

        <AdmissionFormHeader />

        <div className="space-y-8">
          <StudentInformationSection
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />

          <DocumentsSection
            formData={formData}
            handleFileChange={handleFileChange}
            errors={errors}
          />

          <ParentInformationSection
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />

          <EmergencyContactSection
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />

          <AdmissionSubmitSection
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export default AdmissionPage
