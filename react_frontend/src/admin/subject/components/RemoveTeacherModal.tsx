

"use client"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog"
import { Badge } from "../../../components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface Subject {
  _id: string
  name: string
  subjectType: "Core" | "Language" | "Elective"
  assignedTeachers?: string[]
  totalMark: number
  passMark: number
  createdAt: string
  updatedAt: string
}

interface RemoveTeacherModalProps {
  isOpen: boolean
  onClose: () => void
  subject: Subject | null
  onRemoveTeacher: (subjectId: string, teacherId: string) => void
}

const mockTeachers = [
  { id: "teacher1", name: "Dr. Sarah Johnson", subject: "Mathematics" },
  { id: "teacher2", name: "Prof. Michael Chen", subject: "Physics" },
  { id: "teacher3", name: "Ms. Emily Davis", subject: "English" },
  { id: "teacher4", name: "Mr. David Wilson", subject: "Computer Science" },
  { id: "teacher5", name: "Dr. Lisa Anderson", subject: "Chemistry" },
  { id: "teacher6", name: "Prof. Robert Brown", subject: "History" },
]

export function RemoveTeacherModal({ isOpen, onClose, subject, onRemoveTeacher }: RemoveTeacherModalProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState("")

  const handleSubmit = () => {
    if (selectedTeacherId && subject) {
      onRemoveTeacher(subject._id, selectedTeacherId)
      setSelectedTeacherId("")
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedTeacherId("")
  }

  const assignedTeachers =
    subject?.assignedTeachers?.map((teacherId) => mockTeachers.find((t) => t.id === teacherId)).filter(Boolean) || []

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Remove Teacher
          </DialogTitle>
          <DialogDescription>
            Remove a teacher from <strong>{subject?.name}</strong> subject. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {assignedTeachers.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No teachers are currently assigned to this subject.
            </div>
          ) : (
            <>
              <div className="grid gap-2">
                <Label>Currently Assigned Teachers</Label>
                <div className="flex flex-wrap gap-2">
                  {assignedTeachers.map((teacher) => (
                    <Badge key={teacher?.id} variant="secondary">
                      {teacher?.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="teacher">Select Teacher to Remove</Label>
                <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a teacher to remove" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignedTeachers.map((teacher) => (
                      <SelectItem key={teacher?.id} value={teacher?.id || ""}>
                        {teacher?.name} - {teacher?.subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={!selectedTeacherId || assignedTeachers.length === 0}
          >
            Remove Teacher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
