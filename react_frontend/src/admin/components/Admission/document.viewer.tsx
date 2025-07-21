

import { Button } from "../../../components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../../components/ui/dialog"
import { Download } from "lucide-react"
import type { DocumentPreview } from "../../../types/admission.types"

interface DocumentViewerProps {
  document: DocumentPreview | null
  onClose: () => void
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  return (
    <Dialog open={!!document} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Document Preview: {document?.name}</DialogTitle>
          <DialogDescription>{document?.type}</DialogDescription>
        </DialogHeader>
        {document && (
          <div className="flex justify-center">
            <img
              src={document.url || "/placeholder.svg"}
              alt={document.name}
              className="max-w-full max-h-[70vh] object-contain border rounded-lg"
            />
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
