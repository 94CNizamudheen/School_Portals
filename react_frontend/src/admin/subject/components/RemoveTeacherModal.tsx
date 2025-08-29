
import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {  Dialog, DialogContent, DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,} from "../../../components/ui/dialog"
import { Badge } from "../../../components/ui/badge"
import { AlertTriangle } from "lucide-react"
import type { Subject } from "../../../types/subject.types"
import { useAppSelector } from "../../../hooks/app.hooks"

interface RemoveTeacherModalProps {
  isOpen: boolean
  onClose: () => void
  subject: Subject | null
  onRemoveTeacher: (subjectId: string, teacherId: string) => void
}



export function RemoveTeacherModal({ isOpen, onClose, subject, onRemoveTeacher }: RemoveTeacherModalProps) {
  const [selectedTeacherId, setSelectedTeacherId] = useState("")
  const teachers= useAppSelector((state)=>state.teacher.approved);
  const handleSubmit = () => {
    if (selectedTeacherId && subject) {
      onRemoveTeacher(subject._id as string, selectedTeacherId)
      setSelectedTeacherId("")
    }
  }

  const handleClose = () => {
    onClose()
    setSelectedTeacherId("")
  }

  const assignedTeachers =
    subject?.assignedTeachers?.map((teacherId) => teachers.find((t) => t._id === teacherId)).filter(Boolean) || []

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
                    <Badge key={teacher?._id} variant="secondary">
                      {`${teacher?.firstName} ${teacher?.lastName} `}
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
                      <SelectItem key={teacher?._id} value={teacher?._id || ""}>
                        {`${teacher?.firstName} ${teacher?.lastName} `} - {teacher?.subject}
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
