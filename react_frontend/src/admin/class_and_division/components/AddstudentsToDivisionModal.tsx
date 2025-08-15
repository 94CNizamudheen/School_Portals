import React, { useState } from "react";
import { Search, User, X } from "lucide-react";
import type { Student } from "@/types/student";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  students: Student[]; 
  assignedStudents: string[]; 
  onSubmit: (studentId: string) => void;
}

const AddStudentsToDivisionModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  students, 
  assignedStudents, 
  onSubmit 
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");

  const available = students.filter((s) => !assignedStudents.includes(s._id as string));
  
  const filteredStudents = available.filter((student) =>
    `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.classLevel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    if (selectedStudent) {
      onSubmit(selectedStudent);
      setSelectedStudent("");
      setSearchTerm("");
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedStudent("");
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Add Student to Division</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or class level..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Student List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredStudents.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <User size={48} className="mx-auto mb-4 opacity-50" />
              <p>No available students found</p>
              {searchTerm && (
                <p className="text-sm mt-2">Try adjusting your search terms</p>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  onClick={() => setSelectedStudent(student._id as string)}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedStudent === student._id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-600 hover:border-gray-500 bg-gray-700/50"
                  }`}
                >
                  {/* Profile Picture */}
                  <div className="flex-shrink-0 mr-4">
                    {student.profilePicture ? (
                      <img
                        src={student.profilePicture}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-600"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center border-2 border-gray-600">
                        <span className="text-white font-semibold text-lg">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-lg truncate">
                      {student.firstName} {student.lastName}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      {student.classLevel && (
                        <span className="text-gray-300 text-sm">
                          Class: {student.classLevel}
                        </span>
                      )}
                      {student.email && (
                        <span className="text-gray-400 text-sm truncate">
                          {student.email}
                        </span>
                      )}
                    </div>
                    {student._id && (
                      <span className="text-gray-500 text-xs">
                        ID: {student._id}
                      </span>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  {selectedStudent === student._id && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="text-gray-400 text-sm">
            {filteredStudents.length} available student{filteredStudents.length !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddStudent}
              disabled={!selectedStudent}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedStudent
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Add Student
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentsToDivisionModal;