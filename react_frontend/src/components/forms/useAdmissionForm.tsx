import { useState } from "react";
import type { AdmissionFiles, AdmissionFormBody, AdmissionFormErrors, HandleFileChange, HandleInputChange } from "../../types/admission.types";
import { ValidationError } from "yup";

import { admissionValidationSchema } from "../../utils/validationSchemas";
import { createAdmission } from "../../store/admissionThunks";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/notification/useNotification";
import { useAppSelector } from "../../hooks/app.hooks";

const useAdmissionForm = () => {
    const userEmail = useAppSelector((state) => state.auth.userEmail);
    const userName = useAppSelector((state) => state.auth.userName);
    
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate= useNavigate()
    const {showNotification}=useNotification()

    const [formData, setFormData] = useState<AdmissionFormBody>({
        firstName: '',
        lastName: '',
        dob: '',
        address: '',
        bloodGroup: '',
        previousSchool: '',
        medicalInformation: '',
        parentName: userName as string,
        relationToStudent: '',
        email: userEmail as string,
        mobileNumber: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        parentOccupation: '',
        classApplied: '',
        nationality: '',
        state: '',
        pincode: '',
        cast: '',
        religion: '',
        gender: '',
        status: 'pending',
    });
    const [formFile, setFormFile] = useState<AdmissionFiles>({
        profilePicture: null,
        aadharDocument: null,
        birthCertificate: null,
        transferCertificate: null
    })

    const [errors, setErrors] = useState<AdmissionFormErrors>({});

    const handleInputChange: HandleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange: HandleFileChange = (name, file) => {
        setFormFile(prev => ({ ...prev, [name]: file }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = async (): Promise<boolean> => {
        try {
            const dataToValidate = {
                ...formData,
                profilePicture: formFile.profilePicture?.name || '',
                aadharDocument: formFile.aadharDocument?.name || '',
                birthCertificate: formFile.birthCertificate?.name || '',
                transferCertificate: formFile.transferCertificate?.name || ''
            };

            await admissionValidationSchema.validate(dataToValidate, { abortEarly: false });
            setErrors({});
            return true;
        } catch (validationErrors: unknown) {
            const newErrors: AdmissionFormErrors = {};

            if (validationErrors instanceof ValidationError && validationErrors.inner) {
                validationErrors.inner.forEach((error) => {
                    if (error.path) {
                        newErrors[error.path as keyof AdmissionFormErrors] = error.message;
                    }
                });
            }
            setErrors(newErrors);
            return false;
        }
    };

    const handleSubmit = async () => {
        const isValid = await validateForm();
        if (!isValid) return;

        setIsSubmitting(true);
        try {
            await createAdmission(formData, {
                profilePicture: formFile.profilePicture,
                aadharDocument: formFile.aadharDocument,
                birthCertificate: formFile.birthCertificate,
                transferCertificate: formFile.transferCertificate
            })
            showNotification('success',{
                title:"Admission Submition",
                message:"Successfully submitted Admission form"
            })
            setShowSuccessModal(true);
        } catch {
              showNotification('error',{
                title:"Admission Submition",
                message:"Failed to submit Admission form"
            })
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleCloseModal = () => {
        setShowSuccessModal(false);
        navigate('/')
    };

    const handleViewApplication = () => {
        
        console.log("Navigating to application view...");
        navigate('/my-applications')
        setShowSuccessModal(false);
    };
    return {
        formFile,
        formData,
        errors,
        isSubmitting,
        handleInputChange,
        handleFileChange,
        handleSubmit,
        handleViewApplication,
        handleCloseModal,
        showSuccessModal

    };
};

export default useAdmissionForm