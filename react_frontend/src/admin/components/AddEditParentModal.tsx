// AddEditParentModal.tsx
import type { ParentForm } from '../../types/parent';
import { Button } from '../../components/ui/button';

interface Props {
  form: ParentForm;
  editing: boolean;
  onChange: (key: keyof ParentForm, value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export function AddEditParentModal({
  form,
  editing,
  onChange,
  onClose,
  onSave,
}: Props) {
  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-[40%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {editing ? 'Edit Parent' : 'Add Parent'}
        </h2>
        {(Object.keys(form) as (keyof ParentForm)[]).map((key) => (
          <div key={key as string} className="mb-2">
            <label className="block text-sm font-medium mb-1 capitalize dark:text-gray-200">
              {(key as string).replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              value={form[key] || ''}
              onChange={(e) => onChange(key, e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        ))}
        <div className="mt-4 flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSave}>{editing ? 'Update' : 'Create'}</Button>
        </div>
      </div>
    </div>
  );
}
