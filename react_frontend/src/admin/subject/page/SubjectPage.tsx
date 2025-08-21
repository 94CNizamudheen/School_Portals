import { useEffect, useState } from "react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { BookOpen, Plus, MoreHorizontal, Users, GraduationCap, Edit, Trash2, UserPlus, UserMinus } from "lucide-react"
import { RemoveTeacherModal } from "../components/RemoveTeacherModal"
import { CreateSubjectModal } from "../components/CreateSubjectModal"
import { EditSubjectModal } from "../components/EditSubjectModal"
import { AssignTeacherModal } from "../components/AssignTeacherModal"
import type { Subject } from "../../../types/subject.types"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/store/store"
import { assignTeacher, createSubject, deleteSubject, removeTeacher, updateSubject } from "../../../store/subjectThunks"
import { useNotification } from "../../../context/notification/useNotification"
import ConfirmModal from "../../../admin/components/modals/ConfirmDeleteModal"
import StatusFilterWithSearch from "../../../components/shared/filters"
import { CustomPagination } from "../../../components/shared/CustomPagination"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip"

export const SubjectPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAssignTeacherDialogOpen, setIsAssignTeacherDialogOpen] = useState(false)
  const [isRemoveTeacherDialogOpen, setIsRemoveTeacherDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [isConfirmModalOpen, setisConfirmModalOpen] = useState(false);
  const [currentpage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const subjects = useSelector((state: RootState) => state.subjects.subjects);
  const teachers = useSelector((state: RootState) => state.teacher.approved);

  const filterdSubjects = subjects.filter((subject) => {
    const matchesCount = filter === 'all' || subject.subjectType.toLocaleLowerCase() === filter.toLowerCase();
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) || subject.subjectType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCount && matchesSearch
  })


  const subjectsPerPage = 6;
  const indexOfLastSubject = currentpage * subjectsPerPage;
  const indexOfFistSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = filterdSubjects.slice(indexOfFistSubject, indexOfLastSubject);
  const totalPages = Math.ceil(filterdSubjects.length / subjectsPerPage);

  useEffect(() => {
    setCurrentPage(1)
  }, [filter, searchTerm])

  const { showNotification } = useNotification()

  const getSubjectTypeColor = (type: string) => {
    switch (type) {
      case "Core":
        return "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
      case "Language":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
      case "Elective":
        return "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
      default:
        return "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg"
    }
  }

  const handleCreateSubject = async (formData: { name: string, subjectType: "Core" | "Language" | "Elective", totalMark: number, passMark: number, }) => {
    try {
      await dispatch(createSubject(formData)).unwrap()
      setIsCreateDialogOpen(false)
    } catch (error) {
      showNotification('error', { message: error as string })
    }
  };

  const handleEditSubject = async (formData: { name: string, subjectType: "Core" | "Language" | "Elective", totalMark: number, passMark: number }) => {
    if (!selectedSubject || !selectedSubject._id) return
    try {
      await dispatch(updateSubject({ id: selectedSubject._id, data: formData })).unwrap()
      setIsEditDialogOpen(false)
      setSelectedSubject(null)
    } catch (error) {
      showNotification('error', { message: error as string })
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      await dispatch(deleteSubject(id)).unwrap()
    } catch (error) {
      showNotification('error', { message: error as string })
    }
  };

  const openEditDialog = async (subject: Subject) => {
    try {
      setSelectedSubject(subject)
      setIsEditDialogOpen(true)
    } catch (error) {
      showNotification('error', { message: error as string })
    }
  };

  const openAssignTeacherDialog = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsAssignTeacherDialogOpen(true)
  }

  const openRemoveTeacherDialog = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsRemoveTeacherDialogOpen(true)
  }

  const handleAssignTeacher = async (subjectId: string, teacherId: string) => {
    try {
      await dispatch(assignTeacher({ id: subjectId, teacherId })).unwrap()
      setIsAssignTeacherDialogOpen(false)
      setSelectedSubject(null)
    } catch (error) {
      showNotification('error', { message: error as string })
    }
  };

  const handleRemoveTeacher = async (subjectId: string, teacherId: string) => {
    try {
      await dispatch(removeTeacher({ id: subjectId, teacherId }))
      setIsRemoveTeacherDialogOpen(false)
      setSelectedSubject(null)
    } catch (error) {
      showNotification('error', { message: error as string })
    }
  };
  const handleFilterChange = (value: string) => {
    setFilter(value)
  }
  const handleSerachChange = (value: string) => {
    setSearchTerm(value)
  }


  return (
    <div className="min-h-screen ">
      {/* Header */}


      <div className="container mx-auto px-6 py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="backdrop-blur-sm bg-white/10 rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-500 to-gray-100 bg-clip-text text-transparent">
                    Subject Management
                  </h1>
                  <p className="text-gray-300 mt-1">Manage subjects, assign teachers, and configure grading</p>
                </div>
              </div>
              <Button
                className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 px-6 py-3 text-lg font-medium"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-5 w-5" />
                Add Subject
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Subjects</p>
                    <p className="text-2xl font-bold text-gray-800">{subjects.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <div className="w-5 h-5 bg-blue-600 rounded-sm" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Core Subjects</p>
                    <p className="text-2xl font-bold text-gray-800">{subjects.filter((s) => s.subjectType === "Core").length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <div className="w-5 h-5 bg-green-600 rounded-sm" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Language Subjects</p>
                    <p className="text-2xl font-bold text-gray-800">{subjects.filter((s) => s.subjectType === "Language").length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/50 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <div className="w-5 h-5 bg-purple-600 rounded-sm" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Elective Subjects</p>
                    <p className="text-2xl font-bold text-gray-800">{subjects.filter((s) => s.subjectType === "Elective").length}</p>
                  </div>
                </div>
              </div>
            </div>
            <StatusFilterWithSearch
              onFilterChange={handleFilterChange}
              onSearchChange={handleSerachChange}
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentSubjects.map((subject) => (
            <Card key={subject._id} className="bg-gradient-to-br from-white via-gray-500 to-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-0 ring-1 ring-gray-200/50 hover:ring-gray-300/50">

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <CardTitle className="text-xl font-bold text-gray-900">{subject.name}</CardTitle>
                    <Badge className={`${getSubjectTypeColor(subject.subjectType)} px-3 py-1 text-sm font-medium`}>
                      {subject.subjectType}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-gray-100 rounded-full">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm shadow-xl border-0 ring-1 ring-gray-200">
                      <DropdownMenuItem onClick={() => openEditDialog(subject)} className="hover:bg-gray-50">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Subject
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openAssignTeacherDialog(subject)} className="hover:bg-gray-50">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Teacher
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openRemoveTeacherDialog(subject)} className="hover:bg-gray-50">
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove Teacher
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 hover:bg-red-50" onClick={() => { setisConfirmModalOpen(true); setSelectedSubject(subject) }}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Subject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Assigned Teachers with hover tooltip */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50/50 rounded-lg p-3 cursor-pointer hover:bg-gray-100 transition">
                        <div className="p-1 bg-gradient-to-br from-gray-500 to-gray-600 rounded-md">
                          <Users className="h-3 w-3 text-white" />
                        </div>
                        <span className="font-medium">
                          {subject.assignedTeachers?.length || 0} teachers assigned
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white text-gray-800 shadow-lg rounded-xl p-3 max-w-xs">
                      {subject.assignedTeachers?.length  ? (
                        <ul className="space-y-2">
                          {subject.assignedTeachers.map((teacherId: string, i: number) => {
                            const teacher = teachers.find((t) => t._id === teacherId);
                            return (
                              <li
                                key={i}
                                className="text-sm text-gray-700 flex items-center gap-2"
                              >
                                {/* Avatar Circle with Initial */}
                                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                                  {teacher?.firstName
                                    ? teacher.firstName.charAt(0)
                                    : "T"}
                                </div>

                                {/* Full Name */}
                                <span className="text-gray-800">
                                  {teacher
                                    ? `${teacher.firstName} ${teacher.lastName || ""}`
                                    : "Unknown Teacher"}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No teachers assigned</p>
                      )}
                    </TooltipContent>


                  </Tooltip>
                </TooltipProvider>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-lg p-4">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                      Total Marks
                    </span>
                    <div className="text-2xl font-bold text-blue-900 mt-1">
                      {subject.totalMark}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-lg p-4">
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                      Pass Marks
                    </span>
                    <div className="text-2xl font-bold text-emerald-900 mt-1">
                      {subject.passMark}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-200 font-medium">
                    Created:{" "}
                    {new Date(subject.createdAt as string).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <CustomPagination
          currentPage={currentpage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />

        <CreateSubjectModal
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onCreateSubject={handleCreateSubject}
        />

        <EditSubjectModal
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          subject={selectedSubject}
          onEditSubject={handleEditSubject}
        />

        <AssignTeacherModal
          isOpen={isAssignTeacherDialogOpen}
          onClose={() => setIsAssignTeacherDialogOpen(false)}
          subject={selectedSubject}
          onAssignTeacher={handleAssignTeacher}
        />

        <RemoveTeacherModal
          isOpen={isRemoveTeacherDialogOpen}
          onClose={() => setIsRemoveTeacherDialogOpen(false)}
          subject={selectedSubject}
          onRemoveTeacher={handleRemoveTeacher}
        />

        <ConfirmModal
          onClose={() => setisConfirmModalOpen(false)}
          open={isConfirmModalOpen}
          onConfirm={() => handleDeleteSubject(selectedSubject?._id as string)}
          description="This Cant be undone"
          title="Remove Subject"
        />
      </div>

    </div>
  )
}
export default SubjectPage