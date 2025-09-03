import type React from "react"
import { GraduationCap, BookOpen, MoreVertical, Umbrella, AlarmClockOff, FileText } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import type { SchoolEventTypes } from "../../../types/academicClaender.types";
import { useAppSelector } from "../../../hooks/app.hooks";

interface AcademicCalendarProps {
    selectedMonth: number
    selectedYear: number
    months: string[]
    weekDays: string[]
    daysInMonth: number
    scheduledEventItems: SchoolEventTypes[]
    handleEventClick: (day: number) => void
    handleDayClick: (day: number, type: "holiday" | "off_day"|'exam') => void
}

const AcademicCalendar: React.FC<AcademicCalendarProps> = ({
    selectedMonth,
    selectedYear,
    months,
    weekDays,
    daysInMonth,
    handleEventClick,
    handleDayClick,
}) => {
    const month = months[selectedMonth]
    const { events, calenderEntries } = useAppSelector((state) => state.academicCalender)

    const isDateOnDay = (dateString: string, day: number): boolean => {
        const eventDate = new Date(dateString)
        return eventDate.getDate() === day && 
               eventDate.getMonth() === selectedMonth && 
               eventDate.getFullYear() === selectedYear
    }


    const isDayInRange = (startDate: string, endDate: string, day: number): boolean => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const currentDay = new Date(selectedYear, selectedMonth, day)
        
        // Set all times to start of day for accurate comparison
        start.setHours(0, 0, 0, 0)
        end.setHours(0, 0, 0, 0)
        currentDay.setHours(0, 0, 0, 0)

        return currentDay >= start && currentDay <= end
    }

    // Get events and entries for a specific day
    const getDayData = (day: number) => {
        const dayEvents = events?.filter(event => {
            if (event.endDate) {
                return isDayInRange(event.date, event.endDate, day)
            }
            return isDateOnDay(event.date, day)
        }) || []

        const dayEntries = calenderEntries?.filter(entry => 
            isDateOnDay(entry.date, day)
        ) || []

        // Check if this day is a start or end date for any event
        const isStartDate = events?.some(event => isDateOnDay(event.date, day)) || false
        const isEndDate = events?.some(event => event.endDate && isDateOnDay(event.endDate, day)) || false

        return { dayEvents, dayEntries, isStartDate, isEndDate }
    }

    return (
        <div className="rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-br from-white via-gray-500 to-white hover:shadow-2xl backdrop-blur-sm p-4 sm:p-6 lg:p-8 text-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-3">
                        <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
                        <span className="hidden sm:inline">Academic Calendar</span>
                        <span className="sm:hidden">Calendar</span>
                    </h2>
                </div>
                <p className="opacity-90 text-sm sm:text-base">Manage school schedule and important dates - {month}</p>
            </div>

            {/* Calendar Grid */}
            <div className="p-3 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-900 via-gray-400 to-gray-950">
                {/* Week headers */}
                <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-4 mb-4 sm:mb-6">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center text-xs sm:text-sm font-semibold text-blue-200 py-2">
                            <span className="hidden sm:inline">{day}</span>
                            <span className="sm:hidden">{day.slice(0, 1)}</span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-4">
                    {/* Empty cells for alignment */}
                    {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }, (_, i) => (
                        <div key={`empty-${i}`} className="min-h-[80px] sm:min-h-[120px] lg:min-h-[140px]"></div>
                    ))}

                    {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {

                        const { dayEvents, dayEntries } = getDayData(day)
                        const hasEventsOrEntries = dayEvents.length > 0 || dayEntries.length > 0

                        return (
                            <div
                                key={day}
                                className={`relative group min-h-[80px] sm:min-h-[120px] lg:min-h-[140px] rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-110 overflow-hidden ${
                                    hasEventsOrEntries 
                                        ? 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 border-blue-400' 
                                        : 'bg-gradient-to-br from-white via-gray-400 to-white border-blue-300'
                                }`}
                            >
                        
                                <div className="absolute top-2 left-2 flex items-center gap-1">
                                    <span className="sm:text-lg font-bold text-blue-600">{day}</span>
                                </div> 

                                
                                {/* Dropdown menu */}
                                <div className="absolute top-2 right-2 group-hover:opacity-100 transition-opacity">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 p-0 rounded-full hover:bg-gray-200"
                                            >
                                                <MoreVertical className="h-4 w-4 text-gray-600" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="w-40">
                                            <DropdownMenuItem onClick={() => handleEventClick(day)}>
                                                
                                                <BookOpen className="mr-2 h-4 w-4 text-blue-600" />
                                                <span>Add Event</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDayClick(day, "off_day")}>
                                                <AlarmClockOff className="mr-2 h-4 w-4 text-orange-600" />
                                                <span>Mark Off Day</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDayClick(day, "holiday")}>
                                                <Umbrella className="mr-2 h-4 w-4 text-green-600" />
                                                <span>Mark Holiday</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleDayClick(day, "exam")}>
                                                <FileText className="mr-2 h-4 w-4 text-cyan-500" />
                                                <span>Mark Exam</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {/* Event titles and calendar entries */}
                                <div className="absolute bottom-0 left-0 right-0 p-1 space-y-1">
                                    {/* Display event titles */}
                                    {dayEvents.slice(0, 2).map((event, index) => (
                                        <div
                                            key={`event-${event.title}-${index}`}
                                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded truncate"
                                            title={`${event.title} - ${event.description || ''}`}
                                        >
                                            {event.title}
                                        </div>
                                    ))}

                                    {/* Display calendar entries */}
                                    {dayEntries.slice(0, 2 - dayEvents.slice(0, 2).length).map((entry, index) => (
                                        <div
                                            key={`entry-${entry.title || entry.date}-${index}`}
                                            className="text-xs bg-green-600 text-white px-2 py-1 rounded truncate"
                                            title={entry.description || entry.title || 'Calendar Entry'}
                                        >
                                            {entry.title || 'Entry'}
                                        </div>
                                    ))}

                                    {/* Show "+X more" if there are more items */}
                                    {(dayEvents.length + dayEntries.length) > 2 && (
                                        <div className="text-xs bg-gray-600 text-white px-2 py-1 rounded text-center">
                                            +{(dayEvents.length + dayEntries.length) - 2} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default AcademicCalendar