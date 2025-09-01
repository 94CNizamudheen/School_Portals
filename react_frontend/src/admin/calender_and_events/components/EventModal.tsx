import type React from "react"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { BookOpen } from "lucide-react"
import type { SchoolEventForm, SchoolEventTypes } from "../../../types/academicClaender.types"
import { eventValidationSchema } from "../../../utils/validationSchemas"
import { useAppDispatch, useAppSelector } from "../../../hooks/app.hooks"
import LoadingIndicator from "../../../components/shared/LoadingIndicator"
import { createEvent, updateEvent } from "../../../store/calenderAndEventsSlice"
import { useNotification } from "../../../context/notification/useNotification"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string | null
  initialData?: SchoolEventTypes & { _id?: string };
  mode?: 'add' | 'edit';
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, selectedDate, initialData, mode }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.academicCalender.loading)
  const { showNotification } = useNotification()

  console.log("initial data", initialData)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SchoolEventForm>({
    resolver: yupResolver(eventValidationSchema),
    mode: "onChange",
    defaultValues: initialData || {
      title: "",
      description: "",
      date: selectedDate || "",
      endDate: "",
      venue: "",
      posterFile: null,
    },
  })
  const onSubmit = async (values: SchoolEventForm) => {
    const formData = new FormData()

    formData.append("title", values.title)
    formData.append("description", values.description)
    formData.append("date", values.date)
    formData.append("endDate", values.endDate)
    formData.append("venue", values.venue)

    if (values.posterFile) {
      formData.append("posterFile", values.posterFile)
    }
    try {
      if (mode === "add" && initialData?._id) {
        await dispatch(updateEvent({ id: initialData._id, data: formData }))
        showNotification("success", { message: "Event updated successfully!" })
      } else {
        await dispatch(createEvent(formData))
        showNotification("success", { message: "Event created successfully!" })
      }

      onClose()
    } catch (error) {
      showNotification("error", { message: error as string })
    }

  }
  const posterFile = watch("posterFile")

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <BookOpen className="w-5 h-5 text-blue-600" />
            {mode === "edit" ? "Edit School Event" : "Add School Event"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-sm font-medium">Event Title *</label>
            <Input placeholder="Event Name" {...register("title")} />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium">Description *</label>
            <Textarea placeholder="Event description..." {...register("description")} className="min-h-[100px]" />
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium">Event Date *</label>
            <Input type="date" {...register("date")} />
            {errors.date && <p className="text-red-500 text-xs">{errors.date.message}</p>}
          </div>

          {/* End Date */}
          <div>
            <label className="text-sm font-medium">End Date *</label>
            <Input type="date" {...register("endDate")} />
            {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate.message}</p>}
          </div>

          {/* Venue */}
          <div>
            <label className="text-sm font-medium">Venue *</label>
            <Input placeholder="Event venue" {...register("venue")} />
            {errors.venue && <p className="text-red-500 text-xs">{errors.venue.message}</p>}
          </div>
          {/* Poster File */}
          <div>
            <label className="text-sm font-medium">Poster File *</label>
            <Input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => setValue("posterFile", e.target.files?.[0] ?? null, { shouldValidate: true })}
            />

            {/* If new file selected, show that */}
            {posterFile && (
              <div className="mt-2">
                <p className="text-xs text-gray-600">Selected: {posterFile.name}</p>
                <img
                  src={URL.createObjectURL(posterFile)}
                  alt="Preview"
                  className="w-32 h-32 rounded-lg object-cover border mt-1"
                />
              </div>
            )}

            {/* If editing and no new file, show existing poster */}
            {!posterFile && mode === "edit" && initialData?.posterUrl && (
              <div className="mt-2">
                <p className="text-xs text-gray-600">Current poster:</p>
                <img
                  src={initialData.posterUrl}
                  alt="Current Poster"
                  className="w-32 h-32 rounded-lg object-cover border mt-1"
                />
              </div>
            )}

            {errors.posterFile && <p className="text-red-500 text-xs">{errors.posterFile.message}</p>}
          </div>


          {/* Actions */}
          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit"  className="bg-blue-600 hover:bg-blue-700">
              {loading ? <LoadingIndicator /> : <>{mode === "edit" ? "Save Changes" : "Add Event"}</>}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EventModal
