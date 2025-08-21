"use client"

import { useState } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {Dialog,DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,} from "../../../components/ui/dialog"

interface CreateSubjectFormData {
  name: string
  subjectType: "Core" | "Language" | "Elective"
  totalMark: number
  passMark: number
}

interface CreateSubjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateSubject: (formData: CreateSubjectFormData) => void
}

export function CreateSubjectModal({ isOpen, onClose, onCreateSubject }: CreateSubjectModalProps) {
  const [formData, setFormData] = useState<CreateSubjectFormData>({
    name: "",
    subjectType: "Core",
    totalMark: 100,
    passMark: 35,
  })

  const resetForm = () =>
    setFormData({ name: "", subjectType: "Core", totalMark: 100, passMark: 35 })

  const handleSubmit = () => {
    onCreateSubject(formData)
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
          <DialogTitle>Create New Subject</DialogTitle>
          <DialogDescription>
            Add a new subject to the curriculum with grading configuration.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Subject Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Subject Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter subject name"
            />
          </div>

          {/* Subject Type */}
          <div className="grid gap-2">
            <Label htmlFor="type">Subject Type</Label>
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
              <Label htmlFor="totalMark">Total Marks</Label>
              <Input
                id="totalMark"
                type="number"
                value={formData.totalMark}
                onChange={(e) =>
                  setFormData({ ...formData, totalMark: Number(e.target.value) || 0 })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="passMark">Pass Marks</Label>
              <Input
                id="passMark"
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
          <Button onClick={handleSubmit}>Create Subject</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
