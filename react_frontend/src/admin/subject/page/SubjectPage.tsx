

import { useState } from "react"
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

export const SubjectPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAssignTeacherDialogOpen, setIsAssignTeacherDialogOpen] = useState(false)
  const [isRemoveTeacherDialogOpen, setIsRemoveTeacherDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const subjects = useSelector((state: RootState) => state.subjects.subjects);
  const { showNotification } = useNotification()

  const getSubjectTypeColor = (type: string) => {
    switch (type) {
      case "Core":
        return "bg-primary text-primary-foreground"
      case "Language":
        return "bg-accent text-accent-foreground"
      case "Elective":
        return "bg-secondary text-secondary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const handleCreateSubject = async (formData: { name: string, subjectType: "Core" | "Language" | "Elective", totalMark: number, passMark: number, }) => {
    try {
      dispatch(createSubject(formData)).unwrap()
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
      dispatch(assignTeacher({ id: subjectId, teacherId })).unwrap()
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-sidebar border-b border-sidebar-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sidebar-accent rounded-lg">
                <GraduationCap className="h-6 w-6 text-sidebar-accent-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-sidebar-foreground">EduAdmin</h1>
                <p className="text-sm text-sidebar-foreground/70">Subject Management System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-sidebar-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-sidebar-accent-foreground">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Subject Management</h2>
            <p className="text-muted-foreground mt-1">Manage subjects, assign teachers, and configure grading</p>
          </div>
          <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Subject
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Core Subjects</CardTitle>
              <div className="h-4 w-4 bg-primary rounded-sm" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.filter((s) => s.subjectType === "Core").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Language Subjects</CardTitle>
              <div className="h-4 w-4 bg-accent rounded-sm" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.filter((s) => s.subjectType === "Language").length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Elective Subjects</CardTitle>
              <div className="h-4 w-4 bg-secondary rounded-sm" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.filter((s) => s.subjectType === "Elective").length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card key={subject._id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    <Badge className={getSubjectTypeColor(subject.subjectType)}>{subject.subjectType}</Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(subject)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Subject
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openAssignTeacherDialog(subject)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign Teacher
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openRemoveTeacherDialog(subject)}>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Remove Teacher
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteSubject(subject._id as string)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Subject
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{subject.assignedTeachers?.length || 0} teachers assigned</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Total Marks:</span>
                    <div className="font-medium">{subject.totalMark}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Pass Marks:</span>
                    <div className="font-medium">{subject.passMark}</div>
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(subject.createdAt as string).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
      </div>
    </div>
  )
}
export default SubjectPage