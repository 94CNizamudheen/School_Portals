import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { calendarEntrySchema, type CalendarEntryForm } from "../../../utils/validationSchemas"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../../components/ui/select"
import { Checkbox } from "../../../components/ui/checkbox"
import type { Division } from "../../../types/division.type"

import { Button } from "../../../components/ui/button"
import { Calendar, FileText, Users, Clock, X } from "lucide-react"

type CalendarEntryModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CalendarEntryForm) => void
  classDivisions: Division[]
  selectedDate: string;
  initialData?: CalendarEntryForm | null;
  mode?: string;
}

const CalendarEntryModal: React.FC<CalendarEntryModalProps> = ({ isOpen, onClose, onSave, classDivisions, selectedDate, initialData, mode }) => {
  const { control, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<CalendarEntryForm>({
    resolver: zodResolver(calendarEntrySchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      date: selectedDate,
      endDate: "",
      applicableClassDivisions: [],
    },
    mode: "onChange",
  })
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData)
      } else {
        reset({
          title: '',
          description: '',
          date: selectedDate,
          endDate: '',
          applicableClassDivisions: [],
          type: ''
        })
      }
    }
  }, [isOpen, initialData, reset, selectedDate])

  const selectedDivisions = watch("applicableClassDivisions") || []
  const allIds = classDivisions.map((d) => d._id)
  const allSelected = selectedDivisions.length === allIds.length

  const toggleSelectAll = (checked: boolean) => {
    setValue("applicableClassDivisions", checked ? allIds : [])
  }

  const toggleDivision = (id: string, checked: boolean) => {
    if (checked) {
      setValue("applicableClassDivisions", [...selectedDivisions, id])
    } else {
      setValue(
        "applicableClassDivisions",
        selectedDivisions.filter((d) => d !== id)
      )
    }
  }

  const handleFormSubmit = (data: CalendarEntryForm) => {
    onSave(data)
    reset()
    onClose()
  }
  console.log('initialData', initialData)
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
        <div className="relative max-w-2xl bg-gradient-to-b from-gray-700 via-white to-gray-700 rounded-2xl shadow-2xl border border-gray-300/50 max-h-[95vh] overflow-hidden transform transition-all duration-300">

          {/* Animated Header */}
          <div className="relative p-6 border-b border-gray-300/50 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-500 to-gray-800" />
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Create Calendar Entry</h2>
                  <p className="text-gray-200">{mode == "edit" ? 'Edit Calendar Entry' : 'Add entry to academic calendar'}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-10 w-10 p-0 hover:bg-gray-700/50 rounded-xl text-gray-200 hover:text-white transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(handleFormSubmit)} className="overflow-y-auto max-h-[calc(95vh-120px)]">
            <div className="p-6 space-y-6 bg-gradient-to-br from-white/90 to-gray-100/90">

              {/* Title Field */}
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      Entry Title
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter calendar entry title"
                      className={`w-full px-4 py-3 bg-white/80 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder:text-gray-500 shadow-sm ${errors.title ? "border-red-400" : "border-gray-300"
                        }`}
                    />
                    {errors.title && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <X className="w-3 h-3" />
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Description Field */}
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600" />
                      Description
                    </label>
                    <textarea
                      {...field}
                      value={field.value ?? ''}
                      rows={4}
                      placeholder="Describe the calendar entry..."
                      className={`w-full px-4 py-3 bg-white/80 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none text-gray-900 placeholder:text-gray-500 shadow-sm ${errors.description ? "border-red-400" : "border-gray-300"
                        }`}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <X className="w-3 h-3" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Event Type Field */}
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      Entry Type
                      <span className="text-red-500">*</span>
                    </label>
                    <Select value={mode=='edit'? initialData?.type :field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={`w-full px-4 py-3 text-gray-900 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm ${errors.type ? "border-red-400" : "border-gray-300"
                        }`}>
                        <SelectValue placeholder="Choose entry type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white shadow-lg border-gray-200 rounded-xl">
                        <SelectItem value="holiday" className="hover:bg-blue-50 rounded-lg m-1">
                          🎉 Holiday
                        </SelectItem>
                        <SelectItem value="off_day" className="hover:bg-green-50 rounded-lg m-1">
                          📴 Off Day
                        </SelectItem>
                        <SelectItem value="exam" className="hover:bg-orange-50 rounded-lg m-1">
                          📝 Exam
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <X className="w-3 h-3" />
                        {errors.type.message}
                      </p>
                    )}
                  </div>
                )}
              />

              {/* Date Range Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        Start Date
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-4 py-3 bg-white/80 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-gray-900 shadow-sm ${errors.date ? "border-red-400" : "border-gray-300"
                          }`}
                      />
                      {errors.date && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          {errors.date.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-600" />
                        End Date
                      </label>
                      <input
                        {...field}
                        value={field.value ?? ''}
                        type="date"
                        className={`w-full px-4 py-3 bg-white/80 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-gray-900 shadow-sm ${errors.endDate ? "border-red-400" : "border-gray-300"
                          }`}
                      />
                      {errors.endDate && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          {errors.endDate.message}
                        </p>
                      )}
                    </div>
                  )}
                />
              </div>

              {/* Class Divisions Selection */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Applicable Class Divisions
                </label>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 space-y-4 shadow-inner">

                  {/* Select All Option */}
                  <div className="flex items-center space-x-3 pb-3 border-b border-blue-200">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) => toggleSelectAll(checked as boolean)}
                      className="border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md"
                    />
                    <span className="font-semibold text-blue-800 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Select All Divisions
                    </span>
                  </div>

                  {/* Individual Divisions */}
                  <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto">
                    {classDivisions.map((div) => (
                      <div
                        key={div._id}
                        className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/60 transition-colors duration-200 border border-transparent hover:border-blue-200"
                      >
                        <Checkbox
                          checked={selectedDivisions.includes(div._id)}
                          onCheckedChange={(checked) =>
                            toggleDivision(div._id, checked as boolean)
                          }
                          className="border-blue-500 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded-md"
                        />
                        <span className="text-gray-700 font-medium">
                          {div.divisionName}
                          <span className="text-blue-600 ml-2 font-semibold">
                            ({div.classLevel})
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-300/50 bg-gradient-to-r from-gray-100/80 via-white/80 to-gray-100/80">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 py-3 h-12 border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-8 py-3 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{mode == 'edit' ? 'Update Entry' : 'Save Entry'}</span>
                </div>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CalendarEntryModal