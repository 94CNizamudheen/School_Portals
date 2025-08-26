

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Umbrella } from "lucide-react"

interface HolidayModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string | null
  holidayTitle: string
  setHolidayTitle: (title: string) => void
  holidayDesc: string
  setHolidayDesc: (desc: string) => void
  onAddHoliday: () => void
}

const HolidayModal: React.FC<HolidayModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  holidayTitle,
  setHolidayTitle,
  holidayDesc,
  setHolidayDesc,
  onAddHoliday,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Umbrella className="w-5 h-5 text-green-600" />
            Mark School Holiday
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              <strong>Selected Date:</strong> {selectedDate}
            </p>
          </div>
          <Input
            placeholder="Holiday Name (e.g., Christmas Day, Summer Break)"
            value={holidayTitle}
            onChange={(e) => setHolidayTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Holiday description or additional notes..."
            value={holidayDesc}
            onChange={(e) => setHolidayDesc(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAddHoliday} disabled={!holidayTitle.trim()} className="bg-green-600 hover:bg-green-700">
            Mark as Holiday
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default HolidayModal
