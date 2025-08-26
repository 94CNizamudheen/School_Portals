

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Coffee } from "lucide-react"

interface OffDayModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string | null
  offDayTitle: string
  setOffDayTitle: (title: string) => void
  offDayDesc: string
  setOffDayDesc: (desc: string) => void
  onAddOffDay: () => void
}

const OffDayModal: React.FC<OffDayModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  offDayTitle,
  setOffDayTitle,
  offDayDesc,
  setOffDayDesc,
  onAddOffDay,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Coffee className="w-5 h-5 text-orange-600" />
            Mark Off Day
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-700">
              <strong>Selected Date:</strong> {selectedDate}
            </p>
          </div>
          <Input
            placeholder="Off Day Reason (e.g., Staff Meeting, Maintenance)"
            value={offDayTitle}
            onChange={(e) => setOffDayTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Additional details about the off day..."
            value={offDayDesc}
            onChange={(e) => setOffDayDesc(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAddOffDay} disabled={!offDayTitle.trim()} className="bg-orange-600 hover:bg-orange-700">
            Mark as Off Day
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OffDayModal
