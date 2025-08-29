
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from "../../../types/store.types"; 
import type { Division } from '../../../types/division.type';
import { XMarkIcon, PlusIcon, TrashIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { updateDivision } from '../../../store/divisionThunks';

interface SubjectManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  division: Division | null;
  onSubjectUpdate: () => void;
  availableSubjects: string[];
}

const SubjectManagementModal: React.FC<SubjectManagementModalProps> = ({ isOpen, onClose, division, onSubjectUpdate, availableSubjects }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [newSubject, setNewSubject] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  useEffect(() => {
  if (division) {
    setSubjects(division.subjects || []);
  }
}, [division]);

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      const updatedSubjects = [...subjects, newSubject.trim()];
      setSubjects(updatedSubjects);
      setNewSubject('');
    }
  };
  const handleRemoveSubject = (subjectToRemove: string) => {
    const updatedSubjects = subjects.filter(subject => subject !== subjectToRemove);
    setSubjects(updatedSubjects);
  };

  const handleSave = async () => {
    if (division) {
      try {
        dispatch(updateDivision({ divisionId: division._id, data:{subjects} }));
        onSubjectUpdate();
        onClose();
      } catch (error) {
        console.error('Error updating subjects:', error);
      }
    }
  };



  if (!isOpen || !division) return null;

  return (
    <div className="fixed inset-0 bg backdrop-blur-sm bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl  max-w-md border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <AcademicCapIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Manage Subjects</h2>
              <p className="text-gray-400 text-sm">{division.divisionName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 p-2 rounded-lg hover:bg-gray-700 transition-all"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 custom-scroll-minimal">
          {/* Add New Subject */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Add Subject
            </label>
            <div className="flex gap-2 ">
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white 
                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-transparent transition-all"
              >
                <option value="">Select a subject...</option>
                {availableSubjects
                  .filter((subject) => !subjects.includes(subject))
                  .map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
              </select>

              <button
                onClick={handleAddSubject}
                disabled={!newSubject.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed 
                 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 
                 transition-all duration-200"
              >
                <PlusIcon className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>


          {/* Current Subjects */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-3">
              Current Subjects ({subjects.length})
            </label>
            <div className="max-h-60 overflow-y-auto space-y-2">
              {subjects.length > 0 ? (
                subjects.map((subject, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-700 rounded-lg p-3 
                             border border-gray-600 hover:border-gray-500 transition-all"
                  >
                    <span className="text-white font-medium">{subject}</span>
                    <button
                      onClick={() => handleRemoveSubject(subject)}
                      className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 
                               transition-all duration-200"
                      title="Remove Subject"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <AcademicCapIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No subjects added yet</p>
                  <p className="text-gray-600 text-xs mt-1">Add a subject above to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 
                     rounded-lg transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                     px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 
                     shadow-lg hover:shadow-xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectManagementModal;