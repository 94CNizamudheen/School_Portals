import type React from "react"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "../../../components/ui/button"
import { BookOpen, Calendar, MapPin, Upload, X, Image, FileText } from "lucide-react"
import type { SchoolEventForm, SchoolEventTypes } from "../../../types/academicClaender.types"
import { eventValidationSchema } from "../../../utils/validationSchemas"
import { useAppDispatch, useAppSelector } from "../../../hooks/app.hooks"
import LoadingIndicator from "../../../components/shared/LoadingIndicator"
import { createEvent } from "../../../store/calenderAndEventsSlice"
import { useNotification } from "../../../context/notification/useNotification"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string | null
  initialData?: SchoolEventTypes & { _id?: string };
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, selectedDate, initialData }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useAppDispatch()
  const loading = useAppSelector((state) => state.academicCalender.loading)
  const { showNotification } = useNotification();
  
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
      await dispatch(createEvent(formData)).unwrap()
      showNotification("success", { message: "Event created successfully!" })
      onClose()
    } catch (error) {
      showNotification("error", { message: error as string })
      onClose()
    }
  }

  const posterFile = watch("posterFile")

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Enhanced Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative  max-w-2xl bg-gradient-to-br from-slate-900 via-slate-300 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 max-h-[95vh] overflow-hidden transform transition-all duration-300">
          
          {/* Animated Header */}
          <div className="relative p-6 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-500 to-white" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 via-gray-500 to-white rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                  <p className="text-slate-300">Add event to academic calendar</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-10 w-10 p-0 hover:bg-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[calc(95vh-120px)]">
            <div className="p-6 space-y-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50">
              
              {/* Title Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Event Title
                  <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("title")}
                  type="text"
                  placeholder="Enter event title"
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder:text-slate-400 ${
                    errors.title ? "border-red-400" : "border-slate-600"
                  }`}
                />
                {errors.title && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-400" />
                  Description
                  <span className="text-red-400">*</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  placeholder="Describe your event in detail..."
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-white placeholder:text-slate-400 ${
                    errors.description ? "border-red-400" : "border-slate-600"
                  }`}
                />
                {errors.description && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Date Range Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    Start Date
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("date")}
                    type="date"
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-white ${
                      errors.date ? "border-red-400" : "border-slate-600"
                    }`}
                  />
                  {errors.date && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      {errors.date.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    End Date
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    {...register("endDate")}
                    type="date"
                    className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-white ${
                      errors.endDate ? "border-red-400" : "border-slate-600"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-red-400 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      {errors.endDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Venue Field */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-400" />
                  Venue
                  <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("venue")}
                  type="text"
                  placeholder="Where will the event take place?"
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white placeholder:text-slate-400 ${
                    errors.venue ? "border-red-400" : "border-slate-600"
                  }`}
                />
                {errors.venue && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {errors.venue.message}
                  </p>
                )}
              </div>

              {/* Poster Upload */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Image className="w-4 h-4 text-pink-400" />
                  Event Poster
                  <span className="text-red-400">*</span>
                </label>

                {posterFile && (
                  <div className="relative w-full h-48 bg-slate-700/30 rounded-xl overflow-hidden border border-slate-600">
                    <img
                      src={URL.createObjectURL(posterFile)}
                      alt="Event poster preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-slate-800/90 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors duration-200 border border-slate-600"
                      >
                        Change Image
                      </button>
                    </div>
                  </div>
                )}

                <div className="border-2 border-dashed border-slate-600 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-slate-800/30">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setValue("posterFile", e.target.files?.[0] ?? null, { shouldValidate: true })}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-3 w-full"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-200">
                        {posterFile ? "Change poster" : "Upload event poster"}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </button>
                </div>

                {posterFile && (
                  <div className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-sm font-medium text-slate-300">Selected file:</p>
                    <p className="text-sm text-slate-400 truncate">{posterFile.name}</p>
                  </div>
                )}

                {errors.posterFile && (
                  <p className="text-sm text-red-400 flex items-center gap-1">
                    <X className="w-3 h-3" />
                    {errors.posterFile.message}
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-slate-700/50 bg-gradient-to-r from-slate-800/80 via-slate-700/80 to-slate-800/80">
              <Button
                type="button"
                variant="destructive"
                onClick={onClose}
                disabled={loading}
                className="px-6 py-3 h-12 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 hover:border-slate-500 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="px-8 py-3 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoadingIndicator/>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Create Event</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EventModal