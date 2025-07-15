import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { parentModalSchema } from '../../utils/validationSchemas';
import * as Yup from 'yup';
import type { ParentForm } from '../../types/parent';

type ValidationErrors = Partial<Record<keyof ParentForm, string>>;

interface Props {
  form: ParentForm;
  editing: boolean;
  onChange: (key: keyof ParentForm, value: string) => void;
  onClose: () => void;
  onSave: () => Promise<void>; 
}

export function AddEditParentModal({
  form,
  editing,
  onChange,
  onClose,
  onSave,
}: Props) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async () => {
    try {
      await parentModalSchema.validate(form, { abortEarly: false });
      setErrors({});
      await onSave();
      onClose();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const formattedErrors: ValidationErrors = {};
        err.inner.forEach((e) => {
          if (e.path) {
            formattedErrors[e.path as keyof ParentForm] = e.message;
          }
        });
        setErrors(formattedErrors);
      } else {
        console.error("Save failed:", err);
      }
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-[40%] max-w-md relative">


        <h2 className="text-xl font-semibold mb-4 text-white">
          {editing ? 'Edit Parent' : 'Add Parent'}
        </h2>

        {(Object.keys(form) as (keyof ParentForm)[]).map((key) => (
          <div key={key as string} className="mb-3">
            <label className="block text-sm font-medium mb-1 capitalize text-gray-200">
              {(key as string).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              value={form[key] || ''}
              onChange={(e) => onChange(key, e.target.value)}
              className={`w-full border rounded px-3 py-2 text-sm ${errors[key] ? 'border-red-500' : ''
                }`}
            />
            {errors[key] && (
              <p className="text-red-500 text-sm mt-1">{errors[key]}</p>
            )}
          </div>
        ))}

        {/* Buttons */}
        <div className="mt-4 flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editing ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
}
