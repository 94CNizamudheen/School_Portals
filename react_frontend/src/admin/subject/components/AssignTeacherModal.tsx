

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {  Dialog, DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,} from "../../../components/ui/dialog"
import { Badge } from "../../../components/ui/badge"

import type { Subject } from "../../../types/subject.types"
import { useSelector } from "react-redux"
import type { RootState }  from "../../../types/store.types"; 

interface AssignTeacherModalProps {
  isOpen: boolean
  onClose: () => void
  subject: Subject | null
  onAssignTeacher: (subjectId: string, teacherId: string) => void
}



export function AssignTeacherModal({ isOpen, onClose, subject, onAssignTeacher }: AssignTeacherModalProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState("")
  const teachers= useSelector((state:RootState)=>state.teacher.approved);

  const handleSubmit = () => {
    if (selectedTeacherId && subject) {
      onAssignTeacher(subject._id as string, selectedTeacherId)
      setSelectedTeacherId("")
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedTeacherId("")
  }

  const availableTeachers = teachers.filter((teacher) => !subject?.assignedTeachers?.includes(teacher._id))

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Teacher</DialogTitle>
          <DialogDescription>
            Assign a teacher to <strong>{subject?.name}</strong> subject.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {subject?.assignedTeachers && subject.assignedTeachers.length > 0 && (
            <div className="grid gap-2">
              <Label>Currently Assigned Teachers</Label>
              <div className="flex flex-wrap gap-2">
                {subject.assignedTeachers.map((teacherId) => {
                  const teacher = teachers.find((t) => t._id === teacherId)
                  return (
                    <Badge key={teacherId} variant="secondary" className="gap-1">
                      {`${teacher?.firstName} ${teacher?.lastName} `}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="teacher">Select Teacher</Label>
            <Select value={selectedTeacherId} onValueChange={setSelectedTeacherId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a teacher to assign" />
              </SelectTrigger>
              <SelectContent>
                {availableTeachers.map((teacher) => (
                  <SelectItem key={teacher._id} value={teacher._id}>
                    {`${teacher?.firstName} ${teacher?.lastName} `} - {teacher.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedTeacherId}>
            Assign Teacher
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
