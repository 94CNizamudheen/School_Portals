import { useState } from "react";
import type { AdmissionFormData, AdmissionFormErrors, HandleFileChange, HandleInputChange } from "../../types/admission.types";
import { ValidationError } from "yup";

import { admissionValidationSchema } from "../../utils/validationSchemas";

const useAdmissionForm = () => {
    const [formData, setFormData] = useState<AdmissionFormData>({
        firstName: '',
        lastName: '',
        dob: '',
        address: '',
        profilePicture: null,
        bloodGroup: '',
        aadharDocument: null,
        birthCertificate: null,
        previousSchool: '',
        transferCertificate: null,
        medicalInformation: '',
        parentName: '',
        relationToStudent: '',
        email: '',
        mobileNumber: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        parentOccupation: '',
        classApplied: ''
    });

    const [errors, setErrors] = useState<AdmissionFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange: HandleInputChange = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileChange: HandleFileChange = (name, file) => {
        setFormData(prev => ({
            ...prev,
            [name]: file
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = async (): Promise<boolean> => {
        try {
            const dataToValidate = {
                ...formData,
                profilePicture: formData.profilePicture?.name || '',
                aadharDocument: formData.aadharDocument?.name || '',
                birthCertificate: formData.birthCertificate?.name || '',
                transferCertificate: formData.transferCertificate?.name || ''
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
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert("Admission form submitted successfully!");
        } catch {
            alert("Error submitting form. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };
    return {
        formData,
        errors,
        isSubmitting,
        handleInputChange,
        handleFileChange,
        handleSubmit
    };
};

export default useAdmissionForm