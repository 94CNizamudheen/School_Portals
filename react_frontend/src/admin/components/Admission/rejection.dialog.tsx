

import { useSelector } from "react-redux"
import LoadingIndicator from "../../../components/shared/LoadingIndicator"
import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { X } from "lucide-react"
import type { RootState } from "../../../types/store.types"; 

interface RejectionDialogProps {
  isOpen: boolean
  rejectionReason: string
  onReasonChange: (reason: string) => void
  onReject: () => void
  onClose: () => void
}

export function RejectionDialog({
  isOpen,
  rejectionReason,
  onReasonChange,
  onReject,
  onClose,
}: RejectionDialogProps) {
 const loading = useSelector((state: RootState) => state.admissions.loading);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reject Application</DialogTitle>
          <DialogDescription>
            Please provide a reason for rejecting this application. The applicant will receive this feedback.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="rejection-reason" className="text-sm font-medium">
              Rejection Reason *
            </Label>
            <Textarea
              id="rejection-reason"
              placeholder="Please specify the reason for rejection (e.g., incomplete documents, eligibility criteria not met, etc.)"
              value={rejectionReason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="mt-2"
              required
            />
          </div>
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                onClick={onReject}
                disabled={!rejectionReason.trim() || loading}
              >
                {loading ? (
                  <LoadingIndicator text="Rejecting..." />
                ) : (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Reject Application
                  </>
                )}
              </Button>
            </div>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
