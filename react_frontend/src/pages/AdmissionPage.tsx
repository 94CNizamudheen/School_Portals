import AdmissionFormHeader from "../components/forms/AdmissionFormHeader";
import AdmissionSubmitSection from "../components/forms/AdmissionSubmitSection";
import DocumentsSection from "../components/forms/DocumentSection";
import EmergencyContactSection from "../components/forms/EmergencyContactSection ";
import ParentInformationSection from "../components/forms/ParentInformationSection ";
import StudentInformationSection from "../components/forms/StudentInformationSection";
import useAdmissionForm from "../components/forms/useAdmissionForm";




const AdmissionPage:React.FC = () => {
    
    const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    handleSubmit
  } = useAdmissionForm();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
