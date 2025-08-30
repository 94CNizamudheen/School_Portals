import type React from "react"
import {  Dialog,  DialogContent,  DialogHeader,  DialogTitle,  DialogFooter,} from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import {  Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue,} from "../../../components/ui/select"
import { Coffee } from "lucide-react"

interface OffDayForm {
  title: string
  description: string
  date: string | null // Changed from startDate to date to match backend
  endDate: string | null
  type: string
  academicYear?: string // Added optional field
  applicableClassDivisions?: string[] // Added optional field
}

interface OffDayModalProps {
  isOpen: boolean
  onClose: () => void
  offDayForm: OffDayForm
  setOffDayForm: React.Dispatch<React.SetStateAction<OffDayForm>>
  onsave: () => void
}

const OffDayModal: React.FC<OffDayModalProps> = ({
  isOpen,
  onClose,
  offDayForm,
  setOffDayForm,
  onsave,
}) => {
  const updateForm = (field: keyof OffDayForm, value: string | null | string[]) => {
    setOffDayForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onsave()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Coffee className="w-5 h-5 text-orange-600" />
            Mark Academic Calendar Entry
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Start Date - renamed to match backend */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Date *</label>
            <Input
              type="date"
              value={offDayForm.date || ""}
              onChange={(e) => updateForm("date", e.target.value)}
              required
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">End Date (Optional)</label>
            <Input
              type="date"
              value={offDayForm.endDate || ""}
              min={offDayForm.date || ""}
              onChange={(e) => updateForm("endDate", e.target.value)}
            />
          </div>

          {/* Type Selection - updated to match backend enum */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Calendar Type *</label>
            <Select
              value={offDayForm.type}
              onValueChange={(val) => updateForm("type", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOLIDAY">Holiday</SelectItem>
                <SelectItem value="OFF_DAY">Off Day</SelectItem>
                <SelectItem value="EXAM">Exam</SelectItem>
                <SelectItem value="EVENT">Event</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Academic Year */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Academic Year (Optional)</label>
            <Input
              placeholder="e.g., 2024-2025"
              value={offDayForm.academicYear || ""}
              onChange={(e) => updateForm("academicYear", e.target.value)}
            />
          </div>

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Title *</label>
            <Input
              placeholder="Title (e.g., Staff Meeting, Maintenance)"
              value={offDayForm.title}
              onChange={(e) => updateForm("title", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              placeholder="Additional details..."
              value={offDayForm.description}
              onChange={(e) => updateForm("description", e.target.value)}
              className="min-h-[80px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !offDayForm.title.trim() ||
              !offDayForm.date ||
              !offDayForm.type
            }
            className="bg-orange-600 hover:bg-orange-700"
          >
            Save Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OffDayModal