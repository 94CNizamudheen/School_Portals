

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

const mockSubjects: Subject[] = [
  {
    _id: "1",
    name: "Mathematics",
    subjectType: "Core",
    assignedTeachers: ["teacher1", "teacher2"],
    totalMark: 100,
    passMark: 35,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
  },
  {
    _id: "2",
    name: "English Literature",
    subjectType: "Language",
    assignedTeachers: ["teacher3"],
    totalMark: 100,
    passMark: 40,
    createdAt: "2024-01-16T09:30:00Z",
    updatedAt: "2024-01-16T09:30:00Z",
  },
  {
    _id: "3",
    name: "Computer Science",
    subjectType: "Elective",
    assignedTeachers: ["teacher4", "teacher5"],
    totalMark: 100,
    passMark: 35,
    createdAt: "2024-01-17T14:15:00Z",
    updatedAt: "2024-01-17T14:15:00Z",
  },
]

export const SubjectPage=()=> {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAssignTeacherDialogOpen, setIsAssignTeacherDialogOpen] = useState(false)
  const [isRemoveTeacherDialogOpen, setIsRemoveTeacherDialogOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

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

  const handleCreateSubject = (formData: {
    name: string
    subjectType: "Core" | "Language" | "Elective"
    totalMark: number
    passMark: number
  }) => {
    const newSubject: Subject = {
      _id: Date.now().toString(),
      ...formData,
      assignedTeachers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setSubjects([...subjects, newSubject])
    setIsCreateDialogOpen(false)
  }

  const handleEditSubject = (formData: {
    name: string
    subjectType: "Core" | "Language" | "Elective"
    totalMark: number
    passMark: number
  }) => {
    if (!selectedSubject) return
    setSubjects(
      subjects.map((s) =>
        s._id === selectedSubject._id ? { ...s, ...formData, updatedAt: new Date().toISOString() } : s,
      ),
    )
    setIsEditDialogOpen(false)
    setSelectedSubject(null)
  }

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s._id !== id))
  }

  const openEditDialog = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsEditDialogOpen(true)
  }

  const openAssignTeacherDialog = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsAssignTeacherDialogOpen(true)
  }

  const openRemoveTeacherDialog = (subject: Subject) => {
    setSelectedSubject(subject)
    setIsRemoveTeacherDialogOpen(true)
  }

  const handleAssignTeacher = (subjectId: string, teacherId: string) => {
    setSubjects(
      subjects.map((subject) =>
        subject._id === subjectId
          ? {
              ...subject,
              assignedTeachers: [...(subject.assignedTeachers || []), teacherId],
              updatedAt: new Date().toISOString(),
            }
          : subject,
      ),
    )
    setIsAssignTeacherDialogOpen(false)
    setSelectedSubject(null)
  }

  const handleRemoveTeacher = (subjectId: string, teacherId: string) => {
    setSubjects(
      subjects.map((subject) =>
        subject._id === subjectId
          ? {
              ...subject,
              assignedTeachers: subject.assignedTeachers?.filter((id) => id !== teacherId) || [],
              updatedAt: new Date().toISOString(),
            }
          : subject,
      ),
    )
    setIsRemoveTeacherDialogOpen(false)
    setSelectedSubject(null)
  }

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
                    Created: {new Date(subject.createdAt).toLocaleDateString()}
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