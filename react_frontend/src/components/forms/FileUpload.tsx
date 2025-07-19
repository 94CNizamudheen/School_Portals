import { AlertCircle, Upload } from "lucide-react";
import { Label } from "../ui/label";
import type { AdmissionFormData, AdmissionFormErrors, HandleFileChange ,FileFieldKeys} from "../../types/admission.types";

interface FileUploadProps {
    formData: AdmissionFormData
    handleFileChange: HandleFileChange;
    errors: AdmissionFormErrors
    name: FileFieldKeys;
    label: string;
    required?: boolean,
    accept?: string
}

const FileUpload: React.FC<FileUploadProps> = ({ name, label, required = false, accept = "*/*", formData, handleFileChange, errors }) => (
    <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium">
            {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
            <input
                id={name}
                type="file"
                accept={accept}
                onChange={(e) => handleFileChange(name, e.target.files?.[0] || null)}
                className="hidden"
            />
            <label
                htmlFor={name}
                className="flex flex-col items-center justify-center cursor-pointer space-y-2"
            >
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-600">
                    {formData[name] ? formData[name]?.name : "Click to upload file"}
                </span>
            </label>
        </div>
        {errors[name] && (
            <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                {errors[name]}
            </p>
        )}
    </div>
);

export default FileUpload
