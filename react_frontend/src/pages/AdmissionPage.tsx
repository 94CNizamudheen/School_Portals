
import AdmissionFormHeader from "../components/forms/AdmissionFormHeader";
import AdmissionSubmitSection from "../components/forms/AdmissionSubmitSection";
import DocumentsSection from "../components/forms/DocumentSection";
import EmergencyContactSection from "../components/forms/EmergencyContactSection ";
import ParentInformationSection from "../components/forms/ParentInformationSection ";
import StudentInformationSection from "../components/forms/StudentInformationSection";
import useAdmissionForm from "../components/forms/useAdmissionForm";
import ApplicationSuucessModal from "../components/modals/ApplicationSuccessModal";


const AdmissionPage: React.FC = () => {
  const successModalTitle = "Your admission form was successfully received. We’ll notify you about the next steps shortly.";
  const successModalMessage = "Admission Form Submitted!";

  const { formFile, formData, errors, isSubmitting, handleInputChange, handleFileChange, handleSubmit, showSuccessModal, handleCloseModal, handleViewApplication } = useAdmissionForm();


  return (
    <div className=" min-h-screen bg-gradient-to-br from-purple-300 to-purple-950 py-8 px-4">
      <div className="sm:w-[70%] md:w-[50%] max-w-4xl mx-auto bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl p-8 shadow-xl">

        <AdmissionFormHeader />

        <div className="space-y-8">
          <StudentInformationSection
            formData={formData}
            handleInputChange={handleInputChange}
            errors={errors}
          />

          <DocumentsSection
            formfile={formFile}
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
            errors={errors}

          />
        </div>
      </div>
      <ApplicationSuucessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        onViewApplication={handleViewApplication}
        title={successModalTitle}
        message={successModalMessage}
        icon="🔍"
        label="Next Step"
        subtext= "Review"
        secondaryButtonText="Go to My application"
      />
    </div>
  );
}

export default AdmissionPage
