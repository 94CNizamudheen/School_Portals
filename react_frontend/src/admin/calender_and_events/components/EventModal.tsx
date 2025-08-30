import type React from "react"
import { useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { BookOpen } from "lucide-react"
import type { SchoolEventForm } from "../pages/SchoolCalender"


interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string | null
  eventForm: SchoolEventForm
  setEventForm: React.Dispatch<React.SetStateAction<SchoolEventForm>>
  onAddEvent: (formData: FormData) => void   
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  eventForm,
  setEventForm,
  onAddEvent,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const updateForm = (field: keyof SchoolEventForm, value: unknown) => {
    setEventForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const formData = new FormData()
    formData.append("title", eventForm.title)
    formData.append("description", eventForm.description)
    formData.append("date", eventForm.date || "")
    formData.append("endDate", eventForm.endDate || "")
    formData.append("venue", eventForm.venue)

    if (eventForm.posterFile) {
      formData.append("posterFile", eventForm.posterFile) 
    }

    onAddEvent(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Add School Event
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
         

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Event Title *</label>
            <Input
              placeholder="Event Name (e.g., Sports Day, Science Fair)"
              value={eventForm.title}
              onChange={(e) => updateForm("title", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Description *</label>
            <Textarea
              placeholder="Event description, timing, and details..."
              value={eventForm.description}
              onChange={(e) => updateForm("description", e.target.value)}
              className="min-h-[100px] resize-none"
              required
            />
          </div>

          {/* Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Event Date *</label>
            <Input
              type="date"
              value={eventForm.date || ""}
              onChange={(e) => updateForm("date", e.target.value)}
              required
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">End Date *</label>
            <Input
              type="date"
              value={eventForm.endDate || ""}
              min={eventForm.date || ""}
              onChange={(e) => updateForm("endDate", e.target.value)}
              required
            />
          </div>

          {/* Venue */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Venue *</label>
            <Input
              placeholder="Event venue (e.g., School Auditorium, Sports Ground)"
              value={eventForm.venue}
              onChange={(e) => updateForm("venue", e.target.value)}
              required
            />
          </div>

          {/* Poster File Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Poster File *</label>
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => updateForm("posterFile", e.target.files?.[0] || null)}
              required
            />
            {eventForm.posterFile && (
              <p className="text-xs text-gray-600">
                Selected file: {eventForm.posterFile.name}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !eventForm.title.trim() ||
              !eventForm.description.trim() ||
              !eventForm.date ||
              !eventForm.endDate ||
              !eventForm.venue.trim() ||
              !eventForm.posterFile
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            Add Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EventModal
