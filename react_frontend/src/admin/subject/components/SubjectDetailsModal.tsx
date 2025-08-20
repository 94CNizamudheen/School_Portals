


import React from "react";
import { X, Plus, User, Trash2 } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  specialization: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  classLevel: string;
  credits: number;
  capacity: number;
  description: string;
  assignedTeachers: Teacher[];
}

interface SubjectDetailsModalProps {
  isOpen: boolean;
  subject: Subject | null;
  onClose: () => void;
  openTeacherModal: (subjectId: string) => void;
  handleOpenRemoveTeacherConfirm: (subjectId: string, teacherId: string) => void;
}

const SubjectDetailsModal: React.FC<SubjectDetailsModalProps> = ({
  isOpen,
  subject,
  onClose,
  openTeacherModal,
  handleOpenRemoveTeacherConfirm,
}) => {
  if (!isOpen || !subject) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{subject.name}</h2>
            <p className="text-gray-600">{subject.code} • Class {subject.classLevel}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Subject Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Subject Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Credits:</span>
                <span className="ml-2 font-medium">{subject.credits}</span>
              </div>
              <div>
                <span className="text-gray-500">Capacity:</span>
                <span className="ml-2 font-medium">{subject.capacity} teachers</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Description:</span>
                <p className="mt-1 text-gray-700">{subject.description}</p>
              </div>
            </div>
          </div>

          {/* Assigned Teachers */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">
                Assigned Teachers ({subject.assignedTeachers.length}/{subject.capacity})
              </h3>
              <button
                onClick={() => openTeacherModal(subject.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Teacher
              </button>
            </div>

            {subject.assignedTeachers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No teachers assigned yet
              </div>
            ) : (
              <div className="space-y-3">
                {subject.assignedTeachers.map((teacher) => (
                  <div key={teacher.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{teacher.name}</div>
                        <div className="text-sm text-gray-500">{teacher.email}</div>
                        <div className="text-sm text-blue-600">{teacher.specialization}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenRemoveTeacherConfirm(subject.id, teacher.id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetailsModal;
