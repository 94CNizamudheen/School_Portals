import type React from "react"
import { useEffect, useState } from "react"
import { Calendar, BookOpen, Coffee, Clock2Icon } from "lucide-react"
import AcademicCalendar from "../components/AcademicCalendar"
import EventsList from "../components/EventList"
import EventModal from "../components/EventModal"
import ConfirmationModal from "../components/ConfirmationModal"
import { Button } from "../../../components/ui/button"
import { useNotification } from "../../../context/notification/useNotification"
import { useAppDispatch, useAppSelector } from "../../../hooks/app.hooks"
import { createCalenderEntry, fetchAllCaledarEntries, fetchAllEvents } from "../../../store/calenderAndEventsSlice"
import type { CalendarEntryForm, SchoolEventForm, SchoolEventTypes } from "../../../types/academicClaender.types"
import { formatDate } from "../../../utils/helpers/dateFormatter"
import CalendarEntryModal from "../components/CalenderEntryModal.tsx"
import { fetchAllDivisions } from "../../../store/divisionThunks.ts"
import CalenderEntryList from "../components/CalenderEntryList.tsx"


const initialEventForm: SchoolEventForm = {
  title: "",
  description: "",
  date: "",
  endDate: "",
  venue: "",
  posterFile: null,
};


const AdminSchedulePage: React.FC = () => {
  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()) // 0–11
  const [selectedYear, setSelectedYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState<string >(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  )

  const [scheduledEventItems, setScheduledEventItems] = useState<SchoolEventTypes[]>([])
  const [isOffDayModalOpen, setOffDayModalOpen] = useState(false)
  const [isEventModalOpen, setEventModalOpen] = useState(false)
  const [isConfirmRemoveOpen, setConfirmRemoveOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<SchoolEventTypes | null>(null)
  const { showNotification } = useNotification()
  const dispatch = useAppDispatch()
  const events = useAppSelector((state) => state.academicCalender.events)
  const calenderEntries = useAppSelector((state) => state.academicCalender.calenderEntries)
  const classDivisions= useAppSelector((state)=>state.divisions.divisions)

  const [eventForm, setEventForm] = useState<SchoolEventForm>(initialEventForm)
  const [selectedView, setSelectedView] = useState<"calendar" | "events"|'entries'>("calendar")
  const handleCloseEventModal = () => {
    setEventForm(initialEventForm)
    setEventModalOpen(false)
  }
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

  const handleDayClick = (day: number) => {
  const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  setSelectedDate(date)
  setOffDayModalOpen(true)
}


  const handleEventClick = (day: number) => {
    const date = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(date)

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

  const handleCalendarEntry = async (data:CalendarEntryForm) => {
    try {
      await dispatch(createCalenderEntry({ data: data })).unwrap()
      showNotification('success', { message: 'Calendar entry created successfully!' })
    } catch (error) {
      showNotification('error', { message: error as string })
    }
  };
  
  const handleConfirmRemove = () => {
    if (itemToRemove) {
      setScheduledEventItems(scheduledEventItems.filter((item) => item._id !== itemToRemove._id))
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
    dispatch(fetchAllCaledarEntries()).unwrap()
    dispatch(fetchAllEvents()).unwrap()
     dispatch(fetchAllDivisions()).unwrap()
  }, [dispatch]);

  useEffect(() => {
    const eventItems: SchoolEventTypes[] = [];
    // const calenderEntries:CalenderEntries[]=[]
    events.forEach((ev) => {
      if (!ev.date) return
      const formatedDate = formatDate(ev.date);
      const formatedEndDate= formatDate(ev.endDate)

      eventItems.push({
        _id: ev._id,
        date: formatedDate,
        type: "event",
        title: ev.title,
        endDate:formatedEndDate,
        venue:ev.venue,
        description:ev.description,
        posterUrl:ev.posterUrl,
      })
    })
    setScheduledEventItems(eventItems)
  }, [events, calenderEntries, eventForm])


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
                  variant={selectedView === "calendar" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedView("calendar")}
                  className="flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Calendar View</span>
                  <span className="sm:hidden">Calendar</span>
                </Button>
                <Button
                  variant={selectedView === "events" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedView("events")}
                  className="flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Events View</span>
                  <span className="sm:hidden">Events</span>
                </Button>
                <Button
                  variant={selectedView === "entries" ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedView("entries")}
                  className="flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  <Clock2Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Entries View</span>
                  <span className="sm:hidden">Entries</span>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium opacity-90">Month:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number.parseInt(e.target.value))}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  >
                    {months.map((monthName, index) => (
                      <option key={index} value={index} className="text-gray-900">
                        {monthName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium opacity-90">Year:</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number.parseInt(e.target.value))}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-2 sm:px-3 py-1 sm:py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
                  >
                    {Array.from({ length: 10 }, (_, i) => 2020 + i).map((year) => (
                      <option key={year} value={year} className="text-gray-900">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
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
            months={months}
            weekDays={weekDays}
            daysInMonth={daysInMonth}
            scheduledEventItems={scheduledEventItems}
            handleEventClick={handleEventClick}
            handleDayClick={handleDayClick}
          />
        )}

        {selectedView === "events" && (
          <EventsList
            month={month}
            scheduledEventItems={scheduledEventItems}
            setSelectedView={setSelectedView}
          />
        )}
        {selectedView === "entries" && (
          <CalenderEntryList
            month={month}
            calenderEntries={calenderEntries}
          />
        )}
      </div>

      <CalendarEntryModal
        isOpen={isOffDayModalOpen}
        onClose={() => setOffDayModalOpen(false)}
        onSave={handleCalendarEntry}
        classDivisions={classDivisions}
        selectedDate={selectedDate}
      />

      <EventModal
        isOpen={isEventModalOpen}
        onClose={handleCloseEventModal}
        selectedDate={selectedDate}
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