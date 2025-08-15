// ClassDivisionManagementPage.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import {  fetchAllDivisions, createDivision,  deleteDivisionById,  assignClassTeacher,  addStudentToDivision,  removeStudentFromDivision,} from "../../../store/divisionThunks";
import type { Division } from "../../../types/division.type";
import CreateDivisionModal from "../components/CreateDevisionModal"; 
import AddStudentsToDivisionModal from "../components/AddstudentsToDivisionModal"; 
import SubjectManagementModal from "../components/SubjectManagementModal"; 
import TeacherAssignmentModal from "../components/TeacherAssignmentModal"; 
import { PlusIcon,  TrashIcon,   UserGroupIcon,   AcademicCapIcon,  UserIcon,  PencilSquareIcon } from '@heroicons/react/24/outline';

export interface CreateDivisionForm {
  divisionName: string;
  subjects: string[];
  classTeacherId: string;
}

export default function ClassDivisionManagementPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [activeDivisionId, setActiveDivisionId] = useState<string | null>(null);

  const { divisions, loading } = useSelector(
    (state: RootState) => state.divisions
  );
  const teachers = useSelector((state: RootState) => state.teacher.approved);
  const students = useSelector((state: RootState) => state.student.students);

  useEffect(() => {
    dispatch(fetchAllDivisions());
  }, [dispatch]);

  const handleCreateDivision = (formData: CreateDivisionForm) => {
    dispatch(
      createDivision({
        divisionName: formData.divisionName,
        subjects: formData.subjects,
        classTeacherId: formData.classTeacherId,
      })
    );
    setIsCreateModalOpen(false);
  };

  const handleDeleteDivision = (divisionId: string) => {
    if (confirm("Are you sure you want to delete this division?")) {
      dispatch(deleteDivisionById(divisionId));
    }
  };

  const handleAssignTeacher = (divisionId: string, teacherId: string) => {
    dispatch(assignClassTeacher({ divisionId, teacherId }));
    setIsTeacherModalOpen(false);
    setActiveDivisionId(null);
  };

  const handleRemoveStudent = (divisionId: string, studentId: string) => {
    if (confirm("Are you sure you want to remove this student?")) {
      dispatch(removeStudentFromDivision({ divisionId, studentId }));
    }
  };

  const handleAddStudentSubmit = (studentId: string) => {
    if (activeDivisionId) {
      dispatch(addStudentToDivision({ divisionId: activeDivisionId, studentId }));
      setIsStudentModalOpen(false);
      setActiveDivisionId(null);
    }
  };

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

  const openStudentModal = (divisionId: string) => {
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

  const getActiveDivision = () => {
    return divisions.find(d => d._id === activeDivisionId) || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

        {/* Divisions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {divisions.map((division: Division) => (
            <div
              key={division._id}
              className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 
                       hover:border-gray-600 transition-all duration-200 overflow-hidden"
            >
              {/* Division Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 border-b border-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      {division.divisionName}
                    </h2>
                    <p className="text-gray-400 text-sm">
                      {division.assignedStudentsId?.length || 0} students
                    </p>
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
              </div>

              <div className="p-6 space-y-6">
                {/* Class Teacher Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-300 font-medium flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Class Teacher
                    </h3>
                    <button
                      onClick={() => openTeacherModal(division._id)}
                      className="text-blue-400 hover:text-blue-300 p-1 rounded 
                               hover:bg-blue-900/20 transition-all duration-200"
                      title="Change Teacher"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-white font-medium">
                      {getTeacherName(division.classTeacherId)}
                    </p>
                  </div>
                </div>

                {/* Subjects Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-300 font-medium flex items-center gap-2">
                      <AcademicCapIcon className="w-4 h-4" />
                      Subjects ({division.subjects?.length || 0})
                    </h3>
                    <button
                      onClick={() => openSubjectModal(division._id)}
                      className="text-green-400 hover:text-green-300 p-1 rounded 
                               hover:bg-green-900/20 transition-all duration-200"
                      title="Manage Subjects"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="min-h-[60px] max-h-[120px] overflow-y-auto">
                    {division.subjects && division.subjects.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {division.subjects.map((subject, index) => (
                          <span
                            key={index}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white 
                                     px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic py-4">
                        No subjects assigned
                      </p>
                    )}
                  </div>
                </div>

                {/* Students Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-300 font-medium flex items-center gap-2">
                      <UserGroupIcon className="w-4 h-4" />
                      Students ({division.assignedStudentsId?.length || 0})
                    </h3>
                    <button
                      onClick={() => openStudentModal(division._id)}
                      className="text-green-400 hover:text-green-300 p-1 rounded 
                               hover:bg-green-900/20 transition-all duration-200"
                      title="Add Student"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3 min-h-[100px] max-h-[150px] overflow-y-auto">
                    {division.assignedStudentsId?.length ? (
                      <div className="space-y-2">
                        {division.assignedStudentsId.map((studentId) => (
                          <div
                            key={studentId}
                            className="flex items-center justify-between bg-gray-600 
                                     rounded-lg p-2 hover:bg-gray-550 transition-colors"
                          >
                            <span className="text-white text-sm font-medium">
                              {getStudentName(studentId)}
                            </span>
                            <button
                              onClick={() => handleRemoveStudent(division._id, studentId)}
                              className="text-red-400 hover:text-red-300 p-1 rounded 
                                       hover:bg-red-900/20 transition-all duration-200"
                              title="Remove Student"
                            >
                              <TrashIcon className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-sm italic">
                          No students assigned
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {divisions.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="text-gray-500 mb-4">
                <AcademicCapIcon className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Divisions Found</h3>
                <p className="text-gray-400 text-center max-w-md">
                  Get started by creating your first class division to organize students and subjects.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                         px-6 py-3 rounded-lg text-white font-medium flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                Create Your First Division
              </button>
            </div>
          )}
        </div>

        {/* Modals */}
        <CreateDivisionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateDivision}
          availableTeachers={getAvailableTeachers()}
        />

        <AddStudentsToDivisionModal
          isOpen={isStudentModalOpen}
          onClose={() => {
            setIsStudentModalOpen(false);
            setActiveDivisionId(null);
          }}
          students={students}
          assignedStudents={getActiveDivision()?.assignedStudentsId || []}
          onSubmit={handleAddStudentSubmit}
    
        />

        <SubjectManagementModal
          isOpen={isSubjectModalOpen}
          onClose={() => {
            setIsSubjectModalOpen(false);
            setActiveDivisionId(null);
          }}
          division={getActiveDivision()}
          onSubjectUpdate={() => {
            dispatch(fetchAllDivisions());
          }}
        />

        <TeacherAssignmentModal
          isOpen={isTeacherModalOpen}
          onClose={() => {
            setIsTeacherModalOpen(false);
            setActiveDivisionId(null);
          }}
          division={getActiveDivision()}
          availableTeachers={getAvailableTeachers()}
          allTeachers={teachers}
          onAssign={handleAssignTeacher}
        />
      </div>
    </div>
  );
}