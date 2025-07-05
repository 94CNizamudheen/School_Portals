import React from 'react';
import { FormTextarea } from './FormTextarea';
import { StudentFormData } from '../../types/student';

interface MedicalInformationFormProps {
  formData: StudentFormData;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const MedicalInformationForm: React.FC<MedicalInformationFormProps> = ({
  formData,
  onChange
}) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Medical Information</h3>
      <div className="grid grid-cols-1 gap-6">
        <FormTextarea
          label="Medical Conditions"
          name="medicalConditions"
          value={formData.medicalConditions}
          onChange={onChange}
          placeholder="Please list any medical conditions or specify 'None'"
        />
        <FormTextarea
          label="Allergies"
          name="allergies"
          value={formData.allergies}
          onChange={onChange}
          placeholder="Please list any allergies or specify 'None'"
        />
        <FormTextarea
          label="Current Medications"
          name="medications"
          value={formData.medications}
          onChange={onChange}
          placeholder="Please list any current medications or specify 'None'"
        />
      </div>
    </div>
  );
};