import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import { X, Calendar, MapPin, FileText, Upload, Image } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { useAppDispatch } from "../../../hooks/app.hooks"
import { updateEvent } from "../../../store/calenderAndEventsSlice"
import { useNotification } from "../../../context/notification/useNotification"
import type { SchoolEventTypes } from "../../../types/academicClaender.types"
import { eventEditSchema } from "../../../utils/validationSchemas"
import { formatToDDMMYYYY } from "../../../utils/helpers/dateFormatter"
import LoadingIndicator from "../../../components/shared/LoadingIndicator"

interface EventEditModalProps {
    isOpen: boolean
    onClose: () => void
    selectedDate: string | null
    initialData: SchoolEventTypes
}

export interface EventEditFormData {
    title: string
    description: string
    date: string
    endDate: string
    venue: string
    posterFile: File | null
    posterUrl?: string
}


const EventEditModal: React.FC<EventEditModalProps> = ({ isOpen, onClose, initialData }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData.posterUrl || null)

    const dispatch = useAppDispatch()
    const { showNotification } = useNotification()

    const { control, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<EventEditFormData>({
        resolver: yupResolver(eventEditSchema),
        defaultValues: {
            title: initialData.title || "",
            description: initialData.description || "",
            date: initialData.date || "",
            endDate: initialData.endDate || "",
            venue: initialData.venue || "",
            posterFile: null,
            posterUrl: initialData.posterUrl || ""
        }
    })

    const posterFile = watch("posterFile")

    useEffect(() => {
        if (posterFile) {
            const url = URL.createObjectURL(posterFile)
            setPreviewUrl(url)
            return () => URL.revokeObjectURL(url)
        } else if (!posterFile && initialData.posterUrl) {
            setPreviewUrl(initialData.posterUrl)
        }
    }, [posterFile, initialData.posterUrl])

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            reset({
                title: initialData.title || "",
                description: initialData.description || "",
                date: initialData.date || "",
                endDate: initialData.endDate || "",
                venue: initialData.venue || "",
                posterFile: null,
                posterUrl: initialData.posterUrl || ""
            })
            setPreviewUrl(initialData.posterUrl || null)
        }
    }, [isOpen, initialData, reset])

    const onSubmit = async (data: EventEditFormData) => {
        if (!initialData._id) return
        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("title", data.title)
            formData.append("description", data.description || "")
            formData.append("date", formatToDDMMYYYY(data.date))
            formData.append("endDate", formatToDDMMYYYY(data.endDate))
            formData.append("venue", data.venue)
            if (data.posterFile) {
                formData.append("posterFile", data.posterFile)
            }
            await dispatch(updateEvent({ id: initialData._id, data: formData })).unwrap()
            showNotification("success", { message: "Event updated successfully!" })
            onClose()
        } catch (error) {
            showNotification("error", { message: error as string || "Failed to update event. Please try again." })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null
        setValue("posterFile", file, { shouldValidate: true })
    }
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-md transition-all duration-300"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative  max-w-2xl bg-gradient-to-br from-slate-900 via-slate-600 to-slate-900 rounded-2xl shadow-2xl border border-slate-700/50 max-h-[95vh] overflow-hidden transform transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b bg-gradient-to-br from-white via-gray-500 to-white hover:shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Edit Event</h2>
                                <p className="text-sm text-gray-200">Update event details</p>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={onClose}
                            className="h-8 w-8 p-0 hover:bg-red-700 rounded-lg"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[calc(90vh-100px)]">
                        <div className="p-6 space-y-6">
                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Event Title *
                                </label>
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="Enter event title"
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.title ? "border-red-300" : "border-gray-300"
                                                }`}
                                        />
                                    )}
                                />
                                {errors.title && (
                                    <p className="text-sm text-red-600">{errors.title.message}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <textarea
                                            {...field}
                                            rows={3}
                                            placeholder="Enter event description (optional)"
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${errors.description ? "border-red-300" : "border-gray-300"
                                                }`}
                                        />
                                    )}
                                />
                                {errors.description && (
                                    <p className="text-sm text-red-600">{errors.description.message}</p>
                                )}
                            </div>

                            {/* Date Range */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Start Date *
                                    </label>
                                    <Controller
                                        name="date"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="text"
                                                placeholder="DD-MM-YYYY"
                                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.date ? "border-red-300" : "border-gray-300"
                                                    }`}
                                            />
                                        )}
                                    />
                                    {errors.date && (
                                        <p className="text-sm text-red-600">{errors.date.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        End Date *
                                    </label>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                type="text"
                                                placeholder="DD-MM-YYYY"
                                                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.endDate ? "border-red-300" : "border-gray-300"
                                                    }`}
                                            />
                                        )}
                                    />
                                    {errors.endDate && (
                                        <p className="text-sm text-red-600">{errors.endDate.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Venue */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Venue *
                                </label>
                                <Controller
                                    name="venue"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            type="text"
                                            placeholder="Enter event venue"
                                            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.venue ? "border-red-300" : "border-gray-300"
                                                }`}
                                        />
                                    )}
                                />
                                {errors.venue && (
                                    <p className="text-sm text-red-600">{errors.venue.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                    <Image className="w-4 h-4" />
                                    Event Poster
                                </label>

                                {previewUrl && (
                                    <div className="relative w-full h-48 bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                                        <img
                                            src={previewUrl}
                                            alt="Event poster preview"
                                            className="w-full h-full object-cover"
                                        />
                                    
                                    </div>
                                )}

                                {/* File Upload */}
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="poster-upload"
                                    />
                                    <label
                                        htmlFor="poster-upload"
                                        className="cursor-pointer flex flex-col items-center gap-2"
                                    >
                                        <Upload className="w-8 h-8 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-400">
                                            {previewUrl ? "Change poster" : "Upload event poster"}
                                        </span>
                                        <span className="text-xs text-gray-200">
                                            PNG, JPG, WEBP up to 5MB
                                        </span>
                                    </label>
                                </div>

                                {errors.posterFile && (
                                    <p className="text-sm text-red-600">{errors.posterFile.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gradient-to-br from-gray-800 via-gray-500 to-white">
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-6 hover:bg-red-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                       <LoadingIndicator/>
                                    </>
                                ) : (
                                    "Update Event"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EventEditModal