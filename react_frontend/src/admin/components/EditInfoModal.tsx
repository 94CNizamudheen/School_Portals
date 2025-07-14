import React from 'react';
import type { Student } from '../../types/student';

interface EditModalProps {
  section: 'personal' | 'academic' | 'contact' | 'medical' | null;
  student: Student;
  onClose: () => void;
  onSave: (updates: Partial<Student>) => void;
}

export const EditModal: React.FC<EditModalProps> = ({ section, student, onClose, onSave }) => {
  const [form, setForm] = React.useState<Partial<Student>>({});

  const handleChange = (field: keyof Student) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  const fieldsMap: Record<string, { label: string; field: keyof Student }[]> = {
    personal: [
      { label: 'Date of Birth', field: 'dateOfBirth' },
      { label: 'Gender', field: 'gender' },
      { label: 'Blood Group', field: 'bloodGroup' },
      { label: 'Nationality', field: 'nationality' },
    ],
    academic: [
      { label: 'Roll Number', field: 'rollNumber' },
      { label: 'Grade', field: 'grade' },
      { label: 'Class', field: 'class' },
      { label: 'Previous School', field: 'previousSchool' },
      { label: 'Enrollment Date', field: 'enrollmentDate' },
    ],
    contact: [
      { label: 'Mobile Number', field: 'mobileNumber' },
      { label: 'Email', field: 'email' },
      { label: 'Address', field: 'address' },
      { label: 'City', field: 'city' },
      { label: 'State', field: 'state' },
      { label: 'Pincode', field: 'pincode' },
    ],
    medical: [
      { label: 'Medical Conditions', field: 'medicalConditions' },
      { label: 'Allergies', field: 'allergies' },
      { label: 'Medications', field: 'medications' },
    ],
  };

  if (!section) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center">
      <div className="bg-gray-700 p-6 rounded-lg w-[40%] max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 capitalize">{section} Information</h2>

        <div className="space-y-4">
          {fieldsMap[section].map(({ label, field }) => (
            <div key={field}>
              <label className="block text-sm font-medium text-amber-200">{label}</label>
              <input
                type="text"
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                defaultValue={student[field] as string}
                onChange={handleChange(field)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
