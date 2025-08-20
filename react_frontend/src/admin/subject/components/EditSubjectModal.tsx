import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {Dialog, DialogContent,  DialogDescription,  DialogFooter,  DialogHeader,  DialogTitle,} from "../../../components/ui/dialog"

import type { Subject } from "../../../types/subject.types"

interface EditSubjectFormData {
  name: string
  subjectType: "Core" | "Language" | "Elective"
  totalMark: number
  passMark: number
}

interface EditSubjectModalProps {
  isOpen: boolean
  onClose: () => void
  subject: Subject | null
  onEditSubject: (formData: EditSubjectFormData) => void
}

export function EditSubjectModal({ isOpen, onClose, subject, onEditSubject }: EditSubjectModalProps) {
  const [formData, setFormData] = useState<EditSubjectFormData>({
    name: "",
    subjectType: "Core",
    totalMark: 100,
    passMark: 35,
  })

  useEffect(() => {
    if (subject) {
      setFormData({
        name: subject.name,
        subjectType: subject.subjectType,
        totalMark: subject.totalMark,
        passMark: subject.passMark,
      })
    }
  }, [subject])

  const resetForm = () =>
    setFormData({ name: "", subjectType: "Core", totalMark: 100, passMark: 35 })

  const handleSubmit = () => {
    onEditSubject(formData)
    resetForm()
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Subject</DialogTitle>
          <DialogDescription>
            Update subject information and grading configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="edit-name">Subject Name</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter subject name"
            />
          </div>

          {/* Type */}
          <div className="grid gap-2">
            <Label htmlFor="edit-type">Subject Type</Label>
            <Select
              value={formData.subjectType}
              onValueChange={(value: "Core" | "Language" | "Elective") =>
                setFormData({ ...formData, subjectType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Core">Core</SelectItem>
                <SelectItem value="Language">Language</SelectItem>
                <SelectItem value="Elective">Elective</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Marks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-totalMark">Total Marks</Label>
              <Input
                id="edit-totalMark"
                type="number"
                value={formData.totalMark}
                onChange={(e) =>
                  setFormData({ ...formData, totalMark: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-passMark">Pass Marks</Label>
              <Input
                id="edit-passMark"
                type="number"
                value={formData.passMark}
                onChange={(e) =>
                  setFormData({ ...formData, passMark: Number(e.target.value) || 0 })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Update Subject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
