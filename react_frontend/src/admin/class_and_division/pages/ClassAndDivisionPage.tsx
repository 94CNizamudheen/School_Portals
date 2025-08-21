import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import { fetchAllDivisions, createDivision, deleteDivisionById, updateDivision, addStudentToDivision, removeStudentFromDivision, } from "../../../store/divisionThunks";
import type { Division } from "../../../types/division.type";
import CreateDivisionModal from "../components/CreateDevisionModal";
import AddStudentsToDivisionModal from "../components/AddstudentsToDivisionModal";
import SubjectManagementModal from "../components/SubjectManagementModal";
import TeacherAssignmentModal from "../components/TeacherAssignmentModal";
import DivisionDetailsModal from "../components/DivisionDetailsModal";
import { PlusIcon, TrashIcon, AcademicCapIcon, EyeIcon, ExclamationTriangleIcon, } from "@heroicons/react/24/outline";
import { useNotification } from "../../../context/notification/useNotification";
import StatusFilterWithSearch from "../../../components/shared/filters";
import { CustomPagination } from "../../../components/shared/CustomPagination";
import ConfirmModal from "../../../admin/components/modals/ConfirmDeleteModal";
import Loading from "../../../components/Loading";

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
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfig, setDeleteConfig] = useState<{ type: "division" | "student", divisionId?: string, studentId?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('')
  const [filterValue, setFilterValue] = useState("all")
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDivisionId, setActiveDivisionId] = useState<string | null>(null);
  const pageSize = 6;


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
  const filteredDivisions = divisions.filter((division) => {
    const matchesSearch =
      division.divisionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      division.classLevel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterValue === "all" ||
      division.classLevel.toLowerCase() === filterValue.toLowerCase();

    return matchesSearch && matchesFilter;
  });
  const totalPages = Math.ceil(filteredDivisions.length / pageSize)
  const start = (currentPage - 1) * pageSize;
  const paginatedDivisions = filteredDivisions.slice(start, start + pageSize)

  /** ============= Handlers ============= */
  const handleCreateDivision = async (formData: CreateDivisionForm) => {
    try {
      await dispatch(createDivision({ classLevel: formData.classLevel, divisionName: formData.divisionName, subjects: formData.subjects, classTeacherId: formData.classTeacherId, capacity: formData.capacity, })).unwrap();
      setIsCreateModalOpen(false);
      showNotification("success", { message: "Division created successfully!" });
    } catch (error) {
      showNotification("error", { message: error as string });
    }
  };

  const handleOpenRemoveStudentConfirm = (divisionId: string, studentId: string) => {
    setDeleteConfig({ type: "student", divisionId, studentId });
    setDeleteModalOpen(true);
  };

  // Division delete
  const handleOpenDeleteDivisionConfirm = (divisionId: string) => {
    setDeleteConfig({ type: "division", divisionId });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfig) return;

    try {
      if (deleteConfig.type === "division" && deleteConfig.divisionId) {
        await dispatch(deleteDivisionById(deleteConfig.divisionId)).unwrap();
        setIsDetailsModalOpen(false);
        setActiveDivisionId(null);
        showNotification("success", { message: "Division deleted successfully!" });
      }

      if (deleteConfig.type === "student" && deleteConfig.divisionId && deleteConfig.studentId) {
        await dispatch(removeStudentFromDivision({
          divisionId: deleteConfig.divisionId,
          studentId: deleteConfig.studentId
        })).unwrap();
        showNotification("success", { message: "Student removed successfully!" });
      }
    } catch (error) {
      showNotification("error", { message: error as string });
    } finally {
      setDeleteModalOpen(false);
      setDeleteConfig(null);
    }
  };


  const handleAssignTeacher = async (divisionId: string, classTeacherId: string) => {
    try {
      await dispatch(updateDivision({ divisionId, data: { classTeacherId } })).unwrap();
      setIsTeacherModalOpen(false);
      setActiveDivisionId(null);
      showNotification("success", { message: "Teacher assigned successfully!" });
    } catch (error) {
      showNotification("error", { message: error as string });
    }
  };


  const handleAddStudentSubmit = async (studentId: string, classLevel: string) => {
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
    "Mathematics", "Malayalam", "Arabic",
    "English", "Physics", "Chemistry", "Biology",
    "History", "Geography", "Computer Science", "Art & Design", "Physical Education",];

  /** ============= Loading State ============= */
  if (loading) {
    return (
      <Loading />
    );
  }

  /** ============= Render ============= */
  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Glass Morphism */}
        <div className="mb-8">
          <div className="backdrop-blur-sm bg-white/30 rounded-3xl p-8 border border-white/10 shadow-xl">
            <div className="flex justify-between items-start mb-6 flex-col lg:flex-row gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl shadow-lg">
                  <AcademicCapIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Class Division Management
                  </h1>
                  <p className="text-gray-600 mt-1">Manage divisions, assign teachers, and organize students</p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-black 
                         px-8 py-4 rounded-2xl text-white font-semibold flex items-center gap-3 
                         transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <PlusIcon className="w-5 h-5" />
                Create Division
              </button>
            </div>
          </div>
        </div>


        <StatusFilterWithSearch
          onFilterChange={setFilterValue}
          onSearchChange={setSearchQuery}
        />
        {/* Divisions Grid */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedDivisions.map((division: Division) => {
            const assignedCount = division.assignedStudents?.length || 0;
            const capacityStatus = getCapacityStatus(
              assignedCount,
              division?.capacity as number
            );

            return (
              <div
                key={division._id}
                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500 rounded-3xl"
              >
                {/* Status Indicator Bar */}
                <div className={`h-2 ${capacityStatus.status === "full"
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : capacityStatus.status === "warning"
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                      : "bg-gradient-to-r from-green-500 to-blue-500"
                  }`}></div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-gray-50/90 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                {/* Delete Button */}
                <button
                  onClick={() => handleOpenDeleteDivisionConfirm(division._id)}
                  className="absolute z-20 top-4 right-4 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 
                           p-2 rounded-xl transition-all duration-300 shadow-lg opacity-80 hover:opacity-100"
                  title="Delete Division"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>

                {/* Division Header */}
                <div className="relative z-10 p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <AcademicCapIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                          Class {division.classLevel}
                        </h2>
                        <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Division {division.divisionName}
                        </h3>
                      </div>
                    </div>

                    {/* Capacity Badge */}
                    <div className={`px-3 py-1 rounded-full text-sm font-bold shadow-lg ${capacityStatus.status === "full"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : capacityStatus.status === "warning"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "bg-green-100 text-green-700 border border-green-200"
                      }`}>
                      {assignedCount}/{division.capacity}
                    </div>
                  </div>

                  {/* Enhanced Capacity Visualization */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">Capacity Status</span>
                      <span className={`text-sm font-bold ${capacityStatus.status === "full" ? "text-red-600" :
                          capacityStatus.status === "warning" ? "text-yellow-600" : "text-green-600"
                        }`}>
                        {Math.round((assignedCount / (division.capacity as number)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${capacityStatus.status === "full"
                            ? "bg-gradient-to-r from-red-500 to-red-600"
                            : capacityStatus.status === "warning"
                              ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                              : "bg-gradient-to-r from-green-500 to-blue-500"
                          }`}
                        style={{ width: `${Math.min((assignedCount / (division.capacity as number)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="relative z-10 px-6 pb-6 space-y-4">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50/80 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <ExclamationTriangleIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Class Teacher</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800 truncate" title={getTeacherName(division.classTeacherId)}>
                        {getTeacherName(division.classTeacherId)}
                      </p>
                    </div>

                    <div className="bg-gray-50/80 rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <ExclamationTriangleIcon className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-xs font-medium text-gray-500">Subjects</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">
                        {division.subjects?.length || 0} Subjects
                      </p>
                    </div>
                  </div>

                  {/* Subject Pills Preview */}
                  {division.subjects && division.subjects.length > 0 && (
                    <div className="bg-gray-50/80 rounded-2xl p-4">
                      <p className="text-xs font-medium text-gray-500 mb-3">Subjects</p>
                      <div className="flex flex-wrap gap-2">
                        {division.subjects.slice(0, 3).map((subject, idx) => (
                          <span
                            key={idx}
                            className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                          >
                            {subject}
                          </span>
                        ))}
                        {division.subjects.length > 3 && (
                          <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                            +{division.subjects.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Show Details Button */}
                  <button
                    onClick={() => openDetailsModal(division._id)}
                    className="w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-black
                             rounded-2xl p-4 flex items-center justify-center gap-3 transition-all duration-300
                             text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    <EyeIcon className="w-5 h-5" />
                    View Details & Manage
                  </button>
                </div>

                {/* Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            );
          })}

          {/* Empty State */}
          {divisions.length === 0 && (
            <div className="col-span-full">
              <div className="backdrop-blur-sm bg-white/30 rounded-3xl p-12 border border-white/20 shadow-xl text-center">
                <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <AcademicCapIcon className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">No Divisions Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Get started by creating your first class division to organize students and subjects efficiently.
                </p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-black 
                           px-8 py-4 rounded-2xl text-white font-semibold flex items-center gap-3 mx-auto
                           transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <PlusIcon className="w-5 h-5" />
                  Create Your First Division
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {divisions.length > 0 && (
          <div className="mt-8">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

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
          onRemoveStudentConfirm={handleOpenRemoveStudentConfirm}
          onOpenStudentModal={openStudentModal}
          onOpenSubjectModal={openSubjectModal}
          onOpenTeacherModal={openTeacherModal}
          getTeacherName={getTeacherName}
          getStudentName={getStudentName}
        />

        {isDeleteModalOpen && deleteConfig && (
          <ConfirmModal
            onClose={() => setDeleteModalOpen(false)}
            open={isDeleteModalOpen}
            onConfirm={handleConfirmDelete}
            title={deleteConfig.type === "division" ? "Delete Division" : "Remove Student"}
            description={
              deleteConfig.type === "division"
                ? "Are you sure you want to delete this division?"
                : "Are you sure you want to remove this student from the division?"
            }
          />
        )}
      </div>
    </div>
  );
}