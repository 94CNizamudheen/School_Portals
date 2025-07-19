import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { AlertCircle } from "lucide-react";

import type { AdmissionFormData, AdmissionFormErrors, HandleInputChange } from "../../types/admission.types";
import type React from "react";
import type { ReactNode } from "react";

interface FormFieldProps {
    name: keyof AdmissionFormData;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    children?: ReactNode;
    errors: AdmissionFormErrors;
    formData: AdmissionFormData;
    handleInputChange: HandleInputChange;
}

const FormField: React.FC<FormFieldProps> = ({ name, label, type = "text", required = false, placeholder = "", children, errors, formData, handleInputChange }) => (
    <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {children || (
            <Input
                id={name}
                type={type}
                value={formData[name] as string}
                onChange={(e) => handleInputChange(name, e.target.value)}
                placeholder={placeholder}
                className={errors[name] ? "border-red-500" : ""}
            />
        )}
        {errors[name] && (
            <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors[name]}
            </p>
        )}
    </div>
);
export default FormField