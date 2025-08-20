

import React from "react";
import { Save } from "lucide-react";

interface SubjectFormData {
  name: string;
  code: string;
  classLevel: string;
  credits: number;
  capacity: number;
}

interface SubjectFormModalProps {
  isOpen: boolean;
  editingSubject?: boolean;
  formData: SubjectFormData;
  setFormData: React.Dispatch<React.SetStateAction<SubjectFormData>>;
  handleSubmit: () => void;
  closeModal: () => void;
}

const SubjectFormModal: React.FC<SubjectFormModalProps> = ({
  isOpen,
  editingSubject = false,
  formData,
  setFormData,
  handleSubmit,
  closeModal,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6">
          {editingSubject ? "Edit Subject" : "Create New Subject"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class Level
            </label>
            <select
              value={formData.classLevel}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, classLevel: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select Class Level</option>
              <option value="9">Class 9</option>
              <option value="10">Class 10</option>
              <option value="11">Class 11</option>
              <option value="12">Class 12</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Credits
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={formData.credits}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    credits: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teacher Capacity
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={formData.capacity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    capacity: parseInt(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              {editingSubject ? "Update" : "Create"}
            </button>
            <button
              onClick={closeModal}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectFormModal;
