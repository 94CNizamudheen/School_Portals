

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { AlertTriangle, XCircle, CheckCircle } from "lucide-react"

interface ScheduleItem {
  id: number
  date: string
  type: "event" | "holiday" | "off_day"
  title: string
  description?: string
  poster?: File | null
}

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  itemToRemove: ScheduleItem | null
  getItemTypeInfo: (type: string) => { label: string; color: string; bg: string }
  onConfirmRemove: () => void
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  itemToRemove,
  getItemTypeInfo,
  onConfirmRemove,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-amber-700">
            <AlertTriangle className="w-5 h-5" />
            Confirm Removal
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <p className="text-amber-800">
              Are you sure you want to remove this{" "}
              <strong>{itemToRemove && getItemTypeInfo(itemToRemove.type).label.toLowerCase()}</strong> from{" "}
              <strong>{itemToRemove?.date}</strong>?
            </p>
            {itemToRemove && (
              <div className="mt-3 p-3 bg-white rounded border">
                <p className="text-sm text-gray-600">
                  <strong>Title:</strong> {itemToRemove.title}
                </p>
                {itemToRemove.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Description:</strong> {itemToRemove.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="flex items-center gap-2 bg-transparent">
            <XCircle className="w-4 h-4" />
            Keep Item
          </Button>
          <Button onClick={onConfirmRemove} variant="destructive" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Remove Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationModal
