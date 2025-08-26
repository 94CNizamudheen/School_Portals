

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { BookOpen } from "lucide-react"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string | null
  eventTitle: string
  setEventTitle: (title: string) => void
  eventDesc: string
  setEventDesc: (desc: string) => void
  eventPoster: File | null
  setEventPoster: (poster: File | null) => void
  onAddEvent: () => void
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  eventTitle,
  setEventTitle,
  eventDesc,
  setEventDesc,
//   eventPoster,
  setEventPoster,
  onAddEvent,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Add School Event
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              <strong>Selected Date:</strong> {selectedDate}
            </p>
          </div>
          <Input
            placeholder="Event Name (e.g., Sports Day, Science Fair)"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Event description, timing, and details..."
            value={eventDesc}
            onChange={(e) => setEventDesc(e.target.value)}
            className="min-h-[100px] resize-none"
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Event Poster/Image (optional)</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setEventPoster(e.target.files ? e.target.files[0] : null)}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAddEvent} disabled={!eventTitle.trim()} className="bg-blue-600 hover:bg-blue-700">
            Add Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EventModal
