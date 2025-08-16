import { ExclamationTriangleIcon, TrashIcon, XMarkIcon, PlusIcon, PencilSquareIcon, AcademicCapIcon, UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";
import type { Division } from "../../../types/division.type";

interface DivisionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  division: Division | null;
  onDeleteDivision: (id: string) => void;
  onRemoveStudent: (divisionId: string, studentId: string) => void;
  onOpenStudentModal: (divisionId: string) => void;
  onOpenSubjectModal: (divisionId: string) => void;
  onOpenTeacherModal: (divisionId: string) => void;
  getTeacherName: (id: string) => string;
  getStudentName: (id: string) => string;
}

export default function DivisionDetailsModal({
  isOpen,
  onClose,
  division,
  onDeleteDivision,
  onRemoveStudent,
  onOpenStudentModal,
  onOpenSubjectModal,
  onOpenTeacherModal,
  getTeacherName,
  getStudentName,
}: DivisionDetailsModalProps) {
  if (!isOpen || !division) return null;

  const assignedCount = division.assignedStudents?.length || 0;
  const capacity = division.capacity || 0;
  const percentage = Math.min((assignedCount / capacity) * 100, 100);

  const getCapacityStatus = (assignedCount: number, capacity: number) => {
    const percentage = (assignedCount / capacity) * 100;
    if (percentage >= 100) return { color: "red", status: "full" };
    if (percentage >= 80) return { color: "yellow", status: "warning" };
    return { color: "green", status: "normal" };
  };

  const capacityStatus = getCapacityStatus(assignedCount, capacity);

  // Fixed handlers - don't close the modal immediately
  const handleOpenTeacherModal = () => {
    onOpenTeacherModal(division._id);
    onClose(); // Close after opening the other modal
  };

  const handleOpenSubjectModal = () => {
    onOpenSubjectModal(division._id);
    onClose(); // Close after opening the other modal
  };

  const handleOpenStudentModal = () => {
    onOpenStudentModal(division._id);
    onClose(); // Close after opening the other modal
  };

  return (
    <div className="fixed inset-0 bg backdrop-blur-sm bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="flex items-center justify-center pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Modal content */}
        <div className="inline-block align-bottom bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4 border-b border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Class: {division.classLevel} - Division: {division.divisionName}
              </h2>
              <p className="text-gray-400 mt-1">Division Details & Management</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onDeleteDivision(division._id)}
                className="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-900/20 transition-all duration-200"
                title="Delete Division"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scroll-glass">
            {/* Capacity */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Capacity Overview</h3>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-300">Current Capacity</span>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-semibold ${
                      capacityStatus.color === "red"
                        ? "text-red-400"
                        : capacityStatus.color === "yellow"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {assignedCount}/{capacity}
                  </span>
                  {capacityStatus.status === "full" && (
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${
                    capacityStatus.color === "red"
                      ? "bg-red-500"
                      : capacityStatus.color === "yellow"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>

            {/* Teacher */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Class Teacher
                </h3>
                <button
                  onClick={handleOpenTeacherModal}
                  className="text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/20 transition-all duration-200"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-600 rounded-lg p-3">
                <p className="text-white font-medium">
                  {getTeacherName(division.classTeacherId)}
                </p>
              </div>
            </div>

            {/* Subjects */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <AcademicCapIcon className="w-5 h-5" />
                  Subjects ({division.subjects?.length || 0})
                </h3>
                <button
                  onClick={handleOpenSubjectModal}
                  className="text-green-400 hover:text-green-300 p-2 rounded-lg hover:bg-green-900/20 transition-all duration-200"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-600 rounded-lg p-3 min-h-[80px] max-h-[150px] overflow-y-auto">
                {division.subjects?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {division.subjects.map((subject, idx) => (
                      <span
                        key={idx}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic text-center">No subjects assigned</p>
                )}
              </div>
            </div>

            {/* Students */}
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <UserGroupIcon className="w-5 h-5" />
                  Students ({assignedCount})
                </h3>
                <button
                  onClick={handleOpenStudentModal}
                  disabled={assignedCount >= capacity}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    assignedCount >= capacity
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-green-400 hover:text-green-300 hover:bg-green-900/20"
                  }`}
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-600 rounded-lg p-3 min-h-[120px] max-h-[250px] overflow-y-auto">
                {division.assignedStudents?.length ? (
                  <div className="space-y-2">
                    {division.assignedStudents.map((studentId) => (
                      <div
                        key={studentId}
                        className="flex items-center justify-between bg-gray-500 rounded-lg p-3 hover:bg-gray-400 transition-colors"
                      >
                        <span className="text-white font-medium">{getStudentName(studentId)}</span>
                        <button
                          onClick={() => onRemoveStudent(division._id, studentId)}
                          className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-900/20 transition-all duration-200"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm italic text-center">No students assigned</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}