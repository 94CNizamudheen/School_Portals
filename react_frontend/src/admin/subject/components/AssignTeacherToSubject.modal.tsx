import React from "react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  specialization: string;
}

interface AssignTeacherModalProps {
  isOpen: boolean;
  activeSubjectId: string | null;
  getAvailableTeachersForSubject: (subjectId: string) => Teacher[];
  assignTeacher: (subjectId: string, teacherId: string) => void;
  onClose: () => void;
}

const AssignTeacherModal: React.FC<AssignTeacherModalProps> = ({
  isOpen,
  activeSubjectId,
  getAvailableTeachersForSubject,
  assignTeacher,
  onClose,
}) => {
  if (!isOpen || !activeSubjectId) return null;

  const availableTeachers = getAvailableTeachersForSubject(activeSubjectId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 max-h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Assign Teacher</h2>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {availableTeachers.length > 0 ? (
            availableTeachers.map((teacher) => (
              <div
                key={teacher.id}
                onClick={() => {
                  assignTeacher(activeSubjectId, teacher.id);
                  onClose();
                }}
                className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer transition-colors"
              >
                <div className="font-medium text-gray-900">{teacher.name}</div>
                <div className="text-sm text-gray-500">{teacher.email}</div>
                <div className="text-sm text-blue-600">{teacher.specialization}</div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-4">
              No teachers available to assign
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AssignTeacherModal;
