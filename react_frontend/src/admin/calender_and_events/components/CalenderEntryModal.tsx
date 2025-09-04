import React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { calendarEntrySchema, type CalendarEntryForm } from "../../../utils/validationSchemas"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, } from "../../../components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "../../../components/ui/select"
import { Checkbox } from "../../../components/ui/checkbox"
import type { Division } from "../../../types/division.type"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Button } from "../../../components/ui/button"

type CalendarEntryModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CalendarEntryForm) => void
  classDivisions: Division[]
  selectedDate:string
}

const CalendarEntryModal: React.FC<CalendarEntryModalProps> = ({ isOpen, onClose, onSave, classDivisions,selectedDate }) => {
  const { control, handleSubmit, formState: { errors }, setValue, watch, reset, } = useForm<CalendarEntryForm>({
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
  console.log('selectedDate',selectedDate)
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
    console.log("calender entry data", data)
    onSave(data)
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Calendar Entry</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4"
        >
          {/* Title */}
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <div>
                <Input placeholder="Title" {...field} />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea placeholder="Description" {...field} value={field.value ?? ''} />
            )}
          />

          {/* Type */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="off_day">Off Day</SelectItem>
                    <SelectItem value="exam">Exam</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>
            )}
          />

          {/* Dates */}
          <div className="flex gap-2">
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <div className="flex-1">
                  <Input type="date" {...field} />
                  {errors.date && (
                    <p className="text-sm text-red-500">{errors.date.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <div className="flex-1">
                  <Input type="date" {...field} value={field.value ?? ''} />
                  {errors.endDate && (
                    <p className="text-sm text-red-500">{errors.endDate.message}</p>
                  )}
                </div>
              )}
            />
          </div>


      
          {/* Class Divisions */}
          <div className="border rounded p-3 space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) =>
                  toggleSelectAll(checked as boolean)
                }
              />
              <span className="font-medium">Select All Divisions</span>
            </div>
            {classDivisions.map((div) => (
              <div
                key={div._id}
                className="flex items-center space-x-2 pl-4"
              >
                <Checkbox
                  checked={selectedDivisions.includes(div._id)}
                  onCheckedChange={(checked) =>
                    toggleDivision(div._id, checked as boolean)
                  }
                />
                <span>{div.divisionName} ({div.classLevel})</span>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CalendarEntryModal
