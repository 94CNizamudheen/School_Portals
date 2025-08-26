

import type React from "react"
import { useState } from "react"
import { Calendar, Umbrella, BookOpen, Coffee } from "lucide-react"
import AcademicCalendar from "../components/AcademicCalendar"
import EventsList from "../components/EventList"
import HolidayModal from "../components/HolidayModal" 
import OffDayModal from "../components/OffdayModal" 
import EventModal from "../components/EventModal" 
import ConfirmationModal from "../components/ConfirmationModal" 
import { Button } from "../../../components/ui/button"

interface ScheduleItem {
  id: number
  date: string
  type: "event" | "holiday" | "off_day"
  title: string
  description?: string
  poster?: File | null
}

const AdminSchedulePage: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [isHolidayModalOpen, setHolidayModalOpen] = useState(false)
  const [isOffDayModalOpen, setOffDayModalOpen] = useState(false)
  const [isEventModalOpen, setEventModalOpen] = useState(false)
  const [isConfirmRemoveOpen, setConfirmRemoveOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<ScheduleItem | null>(null)

  // Holiday form
  const [holidayTitle, setHolidayTitle] = useState("")
  const [holidayDesc, setHolidayDesc] = useState("")

  // Off day form
  const [offDayTitle, setOffDayTitle] = useState("")
  const [offDayDesc, setOffDayDesc] = useState("")

  // Event form
  const [eventTitle, setEventTitle] = useState("")
  const [eventDesc, setEventDesc] = useState("")
  const [eventPoster, setEventPoster] = useState<File | null>(null)

  // Month selection
  const [selectedMonth, setSelectedMonth] = useState(0) 
  const [selectedYear, setSelectedYear] = useState(2025)
  const [selectedView, setSelectedView] = useState<"calendar" | "events">("calendar")

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
  const month = `${months[selectedMonth]} ${selectedYear}`
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const handleDayClick = (day: number, type: "holiday" | "off_day") => {
    const date = `${day} ${month}`
    setSelectedDate(date)

    // Check if item already exists
    const existingItem = scheduleItems.find((item) => item.date === date && item.type === type)
    if (existingItem) {
      // Show confirmation before removing
      setItemToRemove(existingItem)
      setConfirmRemoveOpen(true)
    } else {
      if (type === "holiday") {
        setHolidayModalOpen(true)
      } else {
        setOffDayModalOpen(true)
      }
    }
  }

  const handleEventClick = (day: number) => {
    const date = `${day} ${month}`
    setSelectedDate(date)
    setEventModalOpen(true)
  }

  const handleAddHoliday = () => {
    if (!selectedDate || !holidayTitle.trim()) return
    setScheduleItems([
      ...scheduleItems,
      {
        id: Date.now(),
        date: selectedDate,
        type: "holiday",
        title: holidayTitle,
        description: holidayDesc,
      },
    ])
    setHolidayTitle("")
    setHolidayDesc("")
    setHolidayModalOpen(false)
  }

  const handleAddOffDay = () => {
    if (!selectedDate || !offDayTitle.trim()) return
    setScheduleItems([
      ...scheduleItems,
      {
        id: Date.now(),
        date: selectedDate,
        type: "off_day",
        title: offDayTitle,
        description: offDayDesc,
      },
    ])
    setOffDayTitle("")
    setOffDayDesc("")
    setOffDayModalOpen(false)
  }

  const handleAddEvent = () => {
    if (!selectedDate || !eventTitle.trim()) return
    setScheduleItems([
      ...scheduleItems,
      {
        id: Date.now(),
        date: selectedDate,
        type: "event",
        title: eventTitle,
        description: eventDesc,
        poster: eventPoster,
      },
    ])
    setEventTitle("")
    setEventDesc("")
    setEventPoster(null)
    setEventModalOpen(false)
  }

  const handleConfirmRemove = () => {
    if (itemToRemove) {
      setScheduleItems(scheduleItems.filter((item) => item.id !== itemToRemove.id))
    }
    setConfirmRemoveOpen(false)
    setItemToRemove(null)
  }

  const getScheduleStats = () => {
    const totalEvents = scheduleItems.filter((item) => item.type === "event").length
    const totalHolidays = scheduleItems.filter((item) => item.type === "holiday").length
    const totalOffDays = scheduleItems.filter((item) => item.type === "off_day").length
    return { totalEvents, totalHolidays, totalOffDays }
  }

  const { totalEvents, totalHolidays, totalOffDays } = getScheduleStats()

  const getItemTypeInfo = (type: string) => {
    switch (type) {
      case "holiday":
        return { label: "School Holiday", color: "text-green-800", bg: "bg-green-200" }
      case "off_day":
        return { label: "Off Day", color: "text-orange-800", bg: "bg-orange-200" }
      case "event":
        return { label: "School Event", color: "text-blue-800", bg: "bg-blue-200" }
      default:
        return { label: "", color: "", bg: "" }
    }
  }

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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
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
                  <div className="bg-green-100 p-2 sm:p-3 rounded-xl sm:rounded-2xl">
                    <Umbrella className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Holidays</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{totalHolidays}</p>
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

        {/* Calendar View */}
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
            // getItemTypeInfo={getItemTypeInfo}
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

      <HolidayModal
        isOpen={isHolidayModalOpen}
        onClose={() => setHolidayModalOpen(false)}
        selectedDate={selectedDate}
        holidayTitle={holidayTitle}
        setHolidayTitle={setHolidayTitle}
        holidayDesc={holidayDesc}
        setHolidayDesc={setHolidayDesc}
        onAddHoliday={handleAddHoliday}
      />

      <OffDayModal
        isOpen={isOffDayModalOpen}
        onClose={() => setOffDayModalOpen(false)}
        selectedDate={selectedDate}
        offDayTitle={offDayTitle}
        setOffDayTitle={setOffDayTitle}
        offDayDesc={offDayDesc}
        setOffDayDesc={setOffDayDesc}
        onAddOffDay={handleAddOffDay}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setEventModalOpen(false)}
        selectedDate={selectedDate}
        eventTitle={eventTitle}
        setEventTitle={setEventTitle}
        eventDesc={eventDesc}
        setEventDesc={setEventDesc}
        eventPoster={eventPoster}
        setEventPoster={setEventPoster}
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
