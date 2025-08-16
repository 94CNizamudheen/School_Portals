import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import {
  fetchAllDivisions,
  createDivision,
  deleteDivisionById,
  updateDivision,
  addStudentToDivision,
  removeStudentFromDivision,
} from "../../../store/divisionThunks";
import type { Division } from "../../../types/division.type";

import CreateDivisionModal from "../components/CreateDevisionModal";
import AddStudentsToDivisionModal from "../components/AddstudentsToDivisionModal";
import SubjectManagementModal from "../components/SubjectManagementModal";
import TeacherAssignmentModal from "../components/TeacherAssignmentModal";
import DivisionDetailsModal from "../components/DivisionDetailsModal";

import {
  PlusIcon,
  TrashIcon,
  AcademicCapIcon,
  EyeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

import { useNotification } from "../../../context/notification/useNotification";

export interface CreateDivisionForm {
  divisionName: string;
  subjects: string[];
  classTeacherId: string;
  classLevel: string;
  capacity: number;
}

export default function ClassDivisionManagementPage() {
  const dispatch = useDispatch<AppDispatch>();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeDivisionId, setActiveDivisionId] = useState<string | null>(null);

  const { divisions, loading } = useSelector(
    (state: RootState) => state.divisions
  );
  const teachers = useSelector((state: RootState) => state.teacher.approved);
  const students = useSelector((state: RootState) => state.student.students);

  const { showNotification } = useNotification();

  useEffect(() => {
    dispatch(fetchAllDivisions());
  }, [dispatch]);

  /** ============= Utilities ============= */
  const getCapacityStatus = (assignedCount: number, capacity: number) => {
    const percentage = (assignedCount / capacity) * 100;
    if (percentage >= 100) return { color: "red", status: "full" };
    if (percentage >= 80) return { color: "yellow", status: "warning" };
    return { color: "green", status: "normal" };
  };

  const renderCapacityBar = (assignedCount: number, capacity: number) => {
    const percentage = Math.min((assignedCount / capacity) * 100, 100);
    const status = getCapacityStatus(assignedCount, capacity);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-300">Capacity</span>
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold ${status.color === "red"
                ? "text-red-400"
                : status.color === "yellow"
                  ? "text-yellow-400"
                  : "text-green-400"
                }`}
            >
              {assignedCount}/{capacity}
            </span>
            {status.status === "full" && (
              <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
            )}
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${status.color === "red"
              ? "bg-red-500"
              : status.color === "yellow"
                ? "bg-yellow-500"
                : "bg-green-500"
              }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  /** ============= Handlers ============= */
  const handleCreateDivision = async (formData: CreateDivisionForm) => {
    try {
      await dispatch(
        createDivision({
          classLevel: formData.classLevel,
          divisionName: formData.divisionName,
          subjects: formData.subjects,
          classTeacherId: formData.classTeacherId,
          capacity: formData.capacity,
        })
      ).unwrap();
      setIsCreateModalOpen(false);
      showNotification("success", { message: "Division created successfully!" });
    } catch (error) {
      showNotification("error", { message: error as string });
    }
  };

  const handleDeleteDivision = async (divisionId: string) => {
    if (confirm("Are you sure you want to delete this division?")) {
      try {
        await dispatch(deleteDivisionById(divisionId)).unwrap();
        setIsDetailsModalOpen(false);
        setActiveDivisionId(null);
        showNotification("success", { message: "Division deleted successfully!" });
      } catch (error) {
        showNotification("error", { message: error as string });
      }
    }
  };

  const handleAssignTeacher = async (
    divisionId: string,
    classTeacherId: string
  ) => {
    try {
      await dispatch(
        updateDivision({ divisionId, data: { classTeacherId } })
      ).unwrap();
      setIsTeacherModalOpen(false);
      setActiveDivisionId(null);
      showNotification("success", { message: "Teacher assigned successfully!" });
    } catch (error) {
      showNotification("error", { message: error as string });
    }
  };

  const handleRemoveStudent = async (divisionId: string, studentId: string) => {
    if (confirm("Are you sure you want to remove this student?")) {
      try {
        await dispatch(removeStudentFromDivision({ divisionId, studentId })).unwrap();
        showNotification("success", { message: "Student removed successfully!" });
      } catch (error) {
        showNotification("error", { message: error as string });
      }
    }
  };

  const handleAddStudentSubmit = async (
    studentId: string,
    classLevel: string
  ) => {
    if (activeDivisionId) {
      try {
        await dispatch(
          addStudentToDivision({ divisionId: activeDivisionId, studentId, classLevel })
        ).unwrap();
        setIsStudentModalOpen(false);
        setActiveDivisionId(null);
        showNotification("success", { message: "Student added successfully!" });
      } catch (error) {
        showNotification("error", { message: error as string });
      }
    }
  };

  /** ============= Helpers ============= */
  const getTeacherName = (id: string) => {
    const teacher = teachers.find((t) => t._id === id);
    return teacher ? `${teacher.firstName} ${teacher.lastName}` : "Unassigned";
  };

  const getStudentName = (id: string) => {
    const student = students.find((s) => s._id === id);
    return student ? `${student.firstName} ${student.lastName}` : id;
  };

  const getAvailableTeachers = () => {
    const assignedIds = divisions.map((d) => d.classTeacherId).filter(Boolean);
    return teachers.filter((t) => !assignedIds.includes(t._id));
  };

  const getActiveDivision = () => {
    return divisions.find((d) => d._id === activeDivisionId) || null;
  };

  /** ============= Modal Handlers with Fixed State Management ============= */
  const openStudentModal = (divisionId: string) => {
    const division = divisions.find((d) => d._id === divisionId);
    if (
      division &&
      (division.assignedStudents?.length ?? 0) >= (division.capacity ?? 0)
    ) {
      showNotification("warning", {
        message: "Division has reached maximum capacity!",
      });
      return;
    }
    setActiveDivisionId(divisionId);
    setIsStudentModalOpen(true);
  };

  const openSubjectModal = (divisionId: string) => {
    setActiveDivisionId(divisionId);
    setIsSubjectModalOpen(true);
  };

  const openTeacherModal = (divisionId: string) => {
    setActiveDivisionId(divisionId);
    setIsTeacherModalOpen(true);
  };

  const openDetailsModal = (divisionId: string) => {
    setActiveDivisionId(divisionId);
    setIsDetailsModalOpen(true);
  };


  const closeStudentModal = () => {
    setIsStudentModalOpen(false);
  };

  const closeSubjectModal = () => {
    setIsSubjectModalOpen(false);
  }
  const closeTeacherModal = () => {
    setIsTeacherModalOpen(false);

  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
  };

  /** ============= Available Subjects ============= */
  const availableSubjects = [
    "Mathematics",
    "Malayalam",
    "Arabic",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Computer Science",
    "Art & Design",
    "Physical Education",
  ];

  /** ============= Loading State ============= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-400">Loading divisions...</p>
        </div>
      </div>
    );
  }

  /** ============= Render ============= */
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Class Division Management
            </h1>
            <p className="text-gray-400">
              Manage divisions, assign teachers, and organize students
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                     px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2 
                     transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <PlusIcon className="w-5 h-5" />
            Create Division
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-600/20">
                <AcademicCapIcon className="w-6 h-6 text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Divisions</p>
                <p className="text-2xl font-bold text-white">{divisions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-600/20">
                <ExclamationTriangleIcon className="w-6 h-6 text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-white">
                  {divisions.reduce((total, div) => total + (div.assignedStudents?.length || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-600/20">
                <ExclamationTriangleIcon className="w-6 h-6 text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">At Capacity</p>
                <p className="text-2xl font-bold text-white">
                  {divisions.filter(div =>
                    (div.assignedStudents?.length || 0) >= (div.capacity || 0)
                  ).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divisions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {divisions.map((division: Division) => {
            const assignedCount = division.assignedStudents?.length || 0;
            const capacityStatus = getCapacityStatus(
              assignedCount,
              division?.capacity as number
            );

            return (
              <div
                key={division._id}
                className={`bg-gray-800 rounded-xl shadow-xl border transition-all duration-200 overflow-hidden hover:transform hover:-translate-y-1 ${capacityStatus.status === "full"
                  ? "border-red-500/50 shadow-red-500/10"
                  : capacityStatus.status === "warning"
                    ? "border-yellow-500/50 shadow-yellow-500/10"
                    : "border-gray-700 hover:border-gray-600 shadow-blue-500/10"
                  }`}
              >
                {/* Division Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 border-b border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white mb-1">
                        Class: {division.classLevel}
                      </h2>
                      <h3 className="text-lg font-semibold text-blue-400 mb-2">
                        Division: {division.divisionName}
                      </h3>
                    </div>
                    <button
                      onClick={() => handleDeleteDivision(division._id)}
                      className="text-red-400 hover:text-red-300 p-2 rounded-lg 
                               hover:bg-red-900/20 transition-all duration-200"
                      title="Delete Division"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Capacity Visualization */}
                  {renderCapacityBar(assignedCount, division.capacity as number)}
                </div>

                {/* Summary View */}
                <div className="p-6 space-y-4">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="text-gray-400 mb-1">Teacher</div>
                      <div className="text-white font-medium truncate" title={getTeacherName(division.classTeacherId)}>
                        {getTeacherName(division.classTeacherId)}
                      </div>
                    </div>
                    <div className="bg-gray-700 rounded-lg p-3">
                      <div className="text-gray-400 mb-1">Subjects</div>
                      <div className="text-white font-medium">
                        {division.subjects?.length || 0}
                      </div>
                    </div>
                  </div>

                  {/* Subject Pills Preview */}
                  {division.subjects && division.subjects.length > 0 && (
                    <div className="flex flex-wrap gap-1 max-h-16 overflow-hidden">
                      {division.subjects.slice(0, 3).map((subject, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs"
                        >
                          {subject}
                        </span>
                      ))}
                      {division.subjects.length > 3 && (
                        <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                          +{division.subjects.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Show Details Button */}
                  <button
                    onClick={() => openDetailsModal(division._id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
                             rounded-lg p-3 flex items-center justify-center gap-2 transition-all duration-200
                             text-white font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <EyeIcon className="w-5 h-5" />
                    Show Details
                  </button>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {divisions.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="text-gray-500 mb-4">
                <AcademicCapIcon className="w-20 h-20 mx-auto mb-6 text-gray-600" />
                <h3 className="text-2xl font-semibold mb-3 text-white">No Divisions Found</h3>
                <p className="text-gray-400 text-center max-w-md leading-relaxed">
                  Get started by creating your first class division to organize
                  students and subjects efficiently.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                         px-8 py-4 rounded-lg text-white font-medium flex items-center gap-2 shadow-lg hover:shadow-xl
                         transform hover:-translate-y-0.5 transition-all duration-200"
              >
                <PlusIcon className="w-5 h-5" />
                Create Your First Division
              </button>
            </div>
          )}
        </div>

        {/* ==================== Modals ==================== */}
        <CreateDivisionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateDivision}
          availableTeachers={getAvailableTeachers()}
          availableSubjects={availableSubjects}
        />

        <AddStudentsToDivisionModal
          isOpen={isStudentModalOpen}
          onClose={closeStudentModal}
          students={students}
          assignedStudents={getActiveDivision()?.assignedStudents || []}
          onSubmit={handleAddStudentSubmit}
        />

        <SubjectManagementModal
          isOpen={isSubjectModalOpen}
          onClose={closeSubjectModal}
          division={getActiveDivision()}
          onSubjectUpdate={() => {
            dispatch(fetchAllDivisions());
          }}
          availableSubjects={availableSubjects}
        />

        <TeacherAssignmentModal
          isOpen={isTeacherModalOpen}
          onClose={closeTeacherModal}
          division={getActiveDivision()}
          availableTeachers={getAvailableTeachers()}
          allTeachers={teachers}
          onAssign={handleAssignTeacher}
        />

        <DivisionDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
          division={getActiveDivision()}
          onDeleteDivision={handleDeleteDivision}
          onRemoveStudent={handleRemoveStudent}
          onOpenStudentModal={openStudentModal}
          onOpenSubjectModal={openSubjectModal}
          onOpenTeacherModal={openTeacherModal}
          getTeacherName={getTeacherName}
          getStudentName={getStudentName}
        />
      </div>
    </div>
  );
}