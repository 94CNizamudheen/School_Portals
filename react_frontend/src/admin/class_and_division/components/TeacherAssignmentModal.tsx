


import { useState } from 'react';
import type { Division } from '../../../types/division.type';
import { XMarkIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

import type { Teacher } from '../../../types/teacher.types';

interface TeacherAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  division: Division | null;
  availableTeachers: Teacher[];
  allTeachers: Teacher[];
  onAssign: (divisionId: string, teacherId: string) => void;
}

const TeacherAssignmentModal: React.FC<TeacherAssignmentModalProps> = ({
  isOpen,
  onClose,
  division,
  availableTeachers,
  allTeachers,
  onAssign
}) => {
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const currentTeacher = division?.classTeacherId
    ? allTeachers.find(t => t._id === division.classTeacherId)
    : null;

  const filteredTeachers = availableTeachers.filter(teacher => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    const email = teacher.email?.toLowerCase() || '';
    const subject = teacher.subject?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    return fullName.includes(search) || email.includes(search) || subject.includes(search);
  });

  const handleAssign = () => {
    if (division && selectedTeacherId) {
      onAssign(division._id, selectedTeacherId);
      setSelectedTeacherId('');
      setSearchTerm('');
    }
  };

  // const handleRemoveCurrentTeacher = () => {
  //   if (division) {
  //     onAssign(division._id, '');
  //     setSelectedTeacherId('');
  //   }
  // };

  if (!isOpen || !division) return null;

return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-[40%] max-w-2xl border border-gray-700 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-purple-600 p-2 rounded-lg">
              <UserIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Assign Class Teacher</h2>
              <p className="text-gray-300 text-sm">{division.divisionName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 p-2 rounded-lg hover:bg-gray-800 transition-all"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scroll-minimal">
          {/* Current Teacher */}
          {currentTeacher && (
            <div className="mb-6">
              <label className="block text-gray-200 text-sm font-medium mb-3">
                Current Class Teacher
              </label>
              <div className="bg-emerald-900/20 border border-emerald-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-emerald-600 flex items-center justify-center">
                      {currentTeacher.profileImage ? (
                        <img
                          src={currentTeacher?.profileImage}
                          alt={currentTeacher.firstName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {currentTeacher.firstName} {currentTeacher.lastName}
                      </h3>
                      {currentTeacher.email && (
                        <p className="text-gray-300 text-sm">{currentTeacher.email}</p>
                      )}
                      {currentTeacher.subject && (
                        <p className="text-emerald-400 text-sm">Subject: {currentTeacher.subject}</p>
                      )}
                    </div>
                  </div>
                  {/* <button
                    onClick={handleRemoveCurrentTeacher}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white 
                             font-medium transition-all duration-200"
                  >
                    Remove
                  </button> */}
                </div>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <label className="block text-gray-200 text-sm font-medium mb-2">
              {currentTeacher ? 'Change to Available Teacher' : 'Select Teacher'}
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or subject..."
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white 
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 
                       focus:border-purple-500 transition-all"
            />
          </div>

          {/* Available Teachers */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedTeacherId === teacher._id
                      ? 'bg-purple-900/30 border-purple-500'
                      : 'bg-gray-800 border-gray-600 hover:border-gray-500 hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedTeacherId(teacher._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                        {teacher.profileImage ? (
                          <img
                            src={teacher.profileImage}
                            alt={teacher.firstName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon className="w-4 h-4 text-gray-300" />
                        )}
                      </div>

                      <div>
                        <h3 className="text-white font-semibold">
                          {teacher.firstName} {teacher.lastName}
                        </h3>
                        {teacher.email && (
                          <p className="text-gray-300 text-sm">{teacher.email}</p>
                        )}
                        {teacher.subject && (
                          <p className="text-purple-400 text-sm">Subject: {teacher.subject}</p>
                        )}
                      </div>
                    </div>
                    {selectedTeacherId === teacher._id && (
                      <CheckCircleIcon className="w-6 h-6 text-purple-400" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <UserIcon className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">
                  {searchTerm ? 'No teachers found matching your search' : 'No available teachers'}
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {searchTerm ? 'Try different search terms' : 'All teachers are already assigned'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-700 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 
                     rounded-lg transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedTeacherId}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 
                     hover:to-purple-800 disabled:from-gray-600 disabled:to-gray-700 
                     disabled:cursor-not-allowed px-6 py-2 rounded-lg text-white font-medium 
                     transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Change Class Teacher
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignmentModal;