import React from 'react';
import { FormInput } from './FormInput';
import { FormSelect } from './FormSelect';
import { FormTextarea } from './FormTextarea';
import { StudentFormData } from '../../types/student';

interface AcademicInformationFormProps {
  formData: StudentFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const AcademicInformationForm: React.FC<AcademicInformationFormProps> = ({
  formData,
  onChange
}) => {
  const gradeOptions = [
    { value: '1st Grade', label: '1st Grade' },
    { value: '2nd Grade', label: '2nd Grade' },
    { value: '3rd Grade', label: '3rd Grade' },
    { value: '4th Grade', label: '4th Grade' },
    { value: '5th Grade', label: '5th Grade' },
    { value: '6th Grade', label: '6th Grade' },
    { value: '7th Grade', label: '7th Grade' },
    { value: '8th Grade', label: '8th Grade' },
    { value: '9th Grade', label: '9th Grade' },
    { value: '10th Grade', label: '10th Grade' },
    { value: '11th Grade', label: '11th Grade' },
    { value: '12th Grade', label: '12th Grade' }
  ];

  const classOptions = [
    { value: 'A', label: 'A' },
    { value: 'B', label: 'B' },
    { value: 'C', label: 'C' },
    { value: 'D', label: 'D' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-white mb-4">Academic Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormSelect
          label="Grade"
          name="grade"
          value={formData.grade}
          onChange={onChange}
          options={gradeOptions}
          required
        />
        <FormSelect
          label="Class"
          name="class"
          value={formData.class}
          onChange={onChange}
          options={classOptions}
          required
        />
        <FormInput
          label="Roll Number"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={onChange}
          required
        />
        <FormInput
          label="Previous School"
          name="previousSchool"
          value={formData.previousSchool}
          onChange={onChange}
        />
      </div>
      
      <div className="mt-6">
        <h4 className="text-md font-semibold text-white mb-4">Address Information</h4>
        <div className="grid grid-cols-1 gap-6">
          <FormTextarea
            label="Address"
            name="address"
            value={formData.address}
            onChange={onChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormInput
              label="City"
              name="city"
              value={formData.city}
              onChange={onChange}
              required
            />
            <FormInput
              label="State"
              name="state"
              value={formData.state}
              onChange={onChange}
              required
            />
            <FormInput
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={onChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};