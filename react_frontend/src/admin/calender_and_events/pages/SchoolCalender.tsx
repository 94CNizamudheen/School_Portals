import type React from "react"
import { useEffect, useState } from "react"
import { Calendar, BookOpen, Coffee } from "lucide-react"
import AcademicCalendar from "../components/AcademicCalendar"
import EventsList from "../components/EventList"
import OffDayModal from "../components/OffdayModal"
import EventModal from "../components/EventModal"
import ConfirmationModal from "../components/ConfirmationModal"
import { Button } from "../../../components/ui/button"
import { useNotification } from "../../../context/notification/useNotification"
import { useAppDispatch, useAppSelector } from "../../../hooks/app.hooks"
import { createCalenderEntry, fetchAllCaledarEntries, fetchAllEvents, createEvent } from "../../../store/calenderAndEventsSlice"

interface ScheduleItem {
  id: number
  date: string
  type: "event" | "holiday" | "off_day"
  title: string
  description?: string
  posterFile?: File | null
}
export interface SchoolEventForm {
  title: string;
  description: string;
  date: string | null;
  endDate: string | null;
  venue: string;
  posterFile: File |null ;
}


export interface OffDayForm {
  title: string
  description: string
  date: string | null 
  endDate: string | null
  type: string
  academicYear?: string
  applicableClassDivisions?: string[]
}

export interface SchoolEventForm {
  title: string
  description: string
  date: string | null
  endDate: string | null
  venue: string
  posterFile: File | null
}

const AdminSchedulePage: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isOffDayModalOpen, setOffDayModalOpen] = useState(false)
  const [isEventModalOpen, setEventModalOpen] = useState(false)
  const [isConfirmRemoveOpen, setConfirmRemoveOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<ScheduleItem | null>(null)
  const { showNotification } = useNotification()
  const dispatch = useAppDispatch()
  const events = useAppSelector((state) => state.academicCalender.events)
  const calenderEntries = useAppSelector((state) => state.academicCalender.calenderEntries)

  // Updated form state to match backend
  const [offDayForm, setOffDayForm] = useState<OffDayForm>({
    title: "",
    description: "",
    date: null, 
    endDate: null,
    type: "",
    academicYear: "",
    applicableClassDivisions: []
  })


  const [eventForm, setEventForm] = useState<SchoolEventForm>({
    title: "",
    description: "",
    date: null,
    endDate: null,
    venue: "",
    posterFile: null
  })

  // Month selection
  const [selectedMonth, setSelectedMonth] = useState(0)
  const [selectedYear, setSelectedYear] = useState(2025)
  const [selectedView, setSelectedView] = useState<"calendar" | "events">("calendar")

  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December",
  ]

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
  const month = `${months[selectedMonth]} ${selectedYear}`
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleDayClick = (day: number, type: "holiday" | "off_day") => {
    const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(date)

    setOffDayForm({
      title: "",
      description: "",
      date: date,
      endDate: null,
      type: type === "holiday" ? "HOLIDAY" : "OFF_DAY",
      academicYear: `${selectedYear}-${selectedYear + 1}`,
      applicableClassDivisions: []
    })

    const existingItem = scheduleItems.find((item) => item.date === date && item.type === type)
    if (existingItem) {
      setItemToRemove(existingItem)
      setConfirmRemoveOpen(true)
    } else {
      setOffDayModalOpen(true)
    }
  }

  const handleEventClick = (day: number) => {
    const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(date)
    
    // Reset event form and set the selected date
    setEventForm({
      title: "",
      description: "",
      date: date,
      endDate: date, 
      venue: "",
      posterFile: null
    })
    
    setEventModalOpen(true)
  }

  const handleCalendarEntry = async () => {
    try {
      await dispatch(createCalenderEntry({ data: offDayForm })).unwrap()
      showNotification('success', { message: 'Calendar entry created successfully!' })
      // Reset form
      setOffDayForm({
        title: "",
        description: "",
        date: null,
        endDate: null,
        type: "",
        academicYear: "",
        applicableClassDivisions: []
      })
    } catch (error) {
      showNotification('error', { message: error as string })
    }
  }

  const handleAddEvent = async () => {
  try {
    const formData = new FormData()
    formData.append("title", eventForm.title)
    formData.append("description", eventForm.description)
    formData.append("date", eventForm.date || "")
    formData.append("endDate", eventForm.endDate || "")
    formData.append("venue", eventForm.venue)

    if (eventForm.posterFile) {
      formData.append("posterFile", eventForm.posterFile)
    }

    await dispatch(createEvent(formData)).unwrap()
    showNotification("success", { message: "Event created successfully!" })

    setEventForm({
      title: "",
      description: "",
      date: null,
      endDate: null,
      venue: "",
      posterFile: null,
    })
    setEventModalOpen(false)
  } catch (error) {
    showNotification("error", { message: error as string })
  }
}


  const handleConfirmRemove = () => {
    if (itemToRemove) {
      setScheduleItems(scheduleItems.filter((item) => item.id !== itemToRemove.id))
    }
    setConfirmRemoveOpen(false)
    setItemToRemove(null)
  }

  const getScheduleStats = () => {
    const totalEvents = events.length
    const totalOffDays = calenderEntries.length
    return { totalEvents, totalOffDays }
  }

  const { totalEvents, totalOffDays } = getScheduleStats()


  const getItemTypeInfo = (type: string) => {
    switch (type) {
      case "HOLIDAY":
      case "holiday":
        return { label: "School Holiday", color: "text-green-800", bg: "bg-green-200" }
      case "OFF_DAY":
      case "off_day":
        return { label: "Off Day", color: "text-orange-800", bg: "bg-orange-200" }
      case "EVENT":
      case "event":
        return { label: "School Event", color: "text-blue-800", bg: "bg-blue-200" }
      case "EXAM":
      case "exam":
        return { label: "Exam", color: "text-purple-800", bg: "bg-purple-200" }
      default:
        return { label: "", color: "", bg: "" }
    }
  }

  useEffect(() => {
    dispatch(fetchAllCaledarEntries())
    dispatch(fetchAllEvents())
  }, [dispatch])
  
  return (
    <div className="min-h-screen p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="backdrop-blur-sm bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-white/20 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              {/* View Toggle */}
              <div className="flex gap-1 sm:gap-2 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-1 sm:p-2 shadow-lg border border-white/20 w-full sm:w-auto">
                <Button
                  variant={selectedView === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedView("calendar")}
                  className="flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Calendar View</span>
                  <span className="sm:hidden">Calendar</span>
                </Button>
                <Button
                  variant={selectedView === "events" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedView("events")}
                  className="flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Events View</span>
                  <span className="sm:hidden">Events</span>
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-lg border border-white/20">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Events</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{totalEvents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-lg border border-white/20">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="bg-orange-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                    <Coffee className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Off Days</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{totalOffDays}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 shadow-lg border border-white/20">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="bg-purple-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Month</p>
                    <p className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">
                      <span className="hidden sm:inline">{month}</span>
                      <span className="sm:hidden">
                        {months[selectedMonth].slice(0, 3)} {selectedYear}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedView === "calendar" && (
          <AcademicCalendar
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
            months={months}
            weekDays={weekDays}
            daysInMonth={daysInMonth}
            scheduleItems={scheduleItems}
            handleEventClick={handleEventClick}
            handleDayClick={handleDayClick}
          />
        )}

        {/* Events View */}
        {selectedView === "events" && (
          <EventsList
            month={month}
            scheduleItems={scheduleItems}
            getItemTypeInfo={getItemTypeInfo}
            setItemToRemove={setItemToRemove}
            setConfirmRemoveOpen={setConfirmRemoveOpen}
            setSelectedView={setSelectedView}
          />
        )}
      </div>

      <OffDayModal
        isOpen={isOffDayModalOpen}
        onClose={() => setOffDayModalOpen(false)}
        offDayForm={offDayForm}
        setOffDayForm={setOffDayForm}
        onsave={handleCalendarEntry}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setEventModalOpen(false)}
        selectedDate={selectedDate}
        eventForm={eventForm}
        setEventForm={setEventForm}
        onAddEvent={handleAddEvent}
      />

      <ConfirmationModal
        isOpen={isConfirmRemoveOpen}
        onClose={() => setConfirmRemoveOpen(false)}
        itemToRemove={itemToRemove}
        getItemTypeInfo={getItemTypeInfo}
        onConfirmRemove={handleConfirmRemove}
      />
    </div>
  )
}

export default AdminSchedulePage