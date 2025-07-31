import { useState } from "react";
import type { AdmissionFormData, AdmissionFormErrors, HandleFileChange, HandleInputChange } from "../../types/admission.types";
import { ValidationError } from "yup";

import { admissionValidationSchema } from "../../utils/validationSchemas";
import { toast } from "react-toastify";
import { createAdmission } from "../../store/admissionThunks";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

const useAdmissionForm = () => {
    const userEmail= useSelector((state:RootState)=>state.auth.userEmail);
    const userName= useSelector((state:RootState)=>state.auth.userName);

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

    const [errors, setErrors] = useState<AdmissionFormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange: HandleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange: HandleFileChange = (name, file) => {
        setFormData(prev => ({ ...prev, [name]: file }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
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
            await createAdmission(formData, {
                profilePicture: formData.profilePicture,
                aadharDocument: formData.aadharDocument,
                birthCertificate: formData.birthCertificate,
                transferCertificate: formData.transferCertificate
            })
            toast.success("Admission submitted successfully!");
        } catch {
            toast.error("Error submitting admission form.");
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