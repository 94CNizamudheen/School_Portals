import React from 'react';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { StudentFormData } from '../../types/student';

interface ParentInformationFormProps {
  formData: StudentFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const ParentInformationForm: React.FC<ParentInformationFormProps> = ({
  formData,
  onChange
}) => {
  const relationshipOptions = [
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Guardian', label: 'Guardian' },
    { value: 'Uncle', label: 'Uncle' },
    { value: 'Aunt', label: 'Aunt' },
    { value: 'Other', label: 'Other' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Parent/Guardian Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Parent/Guardian Name"
          name="parentName"
          value={formData.parentName}
          onChange={onChange}
          required
        />
        <FormInput
          label="Parent Phone"
          name="parentPhone"
          type="tel"
          value={formData.parentPhone}
          onChange={onChange}
          required
        />
        <FormInput
          label="Parent Email"
          name="parentEmail"
          type="email"
          value={formData.parentEmail}
          onChange={onChange}
        />
        <FormInput
          label="Occupation"
          name="parentOccupation"
          value={formData.parentOccupation}
          onChange={onChange}
        />
        <FormSelect
          label="Relationship"
          name="relationship"
          value={formData.relationship}
          onChange={onChange}
          options={relationshipOptions}
          required
        />
      </div>
      
      <div className="mt-6">
        <h4 className="text-md font-semibold text-white mb-4">Emergency Contact</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormInput
            label="Emergency Contact Name"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={onChange}
            required
          />
          <FormInput
            label="Emergency Contact Phone"
            name="emergencyContactPhone"
            type="tel"
            value={formData.emergencyContactPhone}
            onChange={onChange}
            required
          />
          <FormInput
            label="Relationship"
            name="emergencyContactRelationship"
            value={formData.emergencyContactRelationship}
            onChange={onChange}
            required
          />
        </div>
      </div>
    </div>
  );
};
