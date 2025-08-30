

import type React from "react"
import { GraduationCap, BookOpen, Coffee, MoreVertical } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"

interface ScheduleItem {
    id: number
    date: string
    type: "holiday" | "off_day" | "event"
    title: string
}

interface AcademicCalendarProps {
    selectedMonth: number
    selectedYear: number
    setSelectedMonth: (month: number) => void
    setSelectedYear: (year: number) => void
    months: string[]
    weekDays: string[]
    daysInMonth: number
    scheduleItems: ScheduleItem[]
    handleEventClick: (day: number) => void
    handleDayClick: (day: number, type: "holiday" | "off_day") => void
}

const AcademicCalendar: React.FC<AcademicCalendarProps> = ({
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    months,
    weekDays,
    daysInMonth,
    scheduleItems,
    handleEventClick,
    handleDayClick,
}) => {
    const month = months[selectedMonth]

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

                    {/* Month/Year Selector */}
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
                <p className="opacity-90 text-sm sm:text-base">Manage school schedule and important dates - {month}</p>
            </div>

            {/* Calendar Grid */}
            <div className="p-3 sm:p-6 lg:p-8">
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
                        const date = `${day} ${month}`
                        const dayItems = scheduleItems.filter((item) => item.date === date)

                        const hasHoliday = dayItems.some((item) => item.type === "holiday")
                        const hasOffDay = dayItems.some((item) => item.type === "off_day")
                        const hasEvent = dayItems.some((item) => item.type === "event")

                        return (
                            <div
                                key={day}
                                className=" relative group min-h-[80px] sm:min-h-[120px] lg:min-h-[140px] bg-gradient-to-br from-white via-gray-400 to-white rounded-xl border-2 border-blue-300 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:scale-110 overflow-hidden "
                            >
                            
                                <div className="absolute top-2 left-2">
                                    <span className="text-lg sm:text-xl font-bold text-blue-600">{day}</span>
                                </div>

                                <div className="absolute top-2 right-2 flex gap-1">
                                    {hasEvent && <BookOpen className="w-4 h-4 text-blue-600" />}
                                    {hasOffDay && <Coffee className="w-4 h-4 text-red-600" />}
                                </div>

                                <div className="absolute top-2 right-2  group-hover:opacity-100 transition-opacity">
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
                                                <Coffee className="mr-2 h-4 w-4 text-orange-600" />
                                                <span>Mark Off Day</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>


                                {(hasHoliday || hasOffDay) && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white px-2 py-1">
                                        <div className="flex items-center gap-1">
                                            <div className="w-0.5 h-4 bg-white rounded-full"></div>
                                            <span className="text-xs font-medium truncate">
                                                {dayItems.find((item) => item.type === "holiday" || item.type === "off_day")?.title}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Event indicator for events only (small blue badge) */}
                                {hasEvent && !hasHoliday && !hasOffDay && (
                                    <div className="absolute bottom-2 left-2 right-2">
                                        <div className="text-xs bg-blue-100 text-blue-800 rounded px-1 py-0.5 font-medium truncate">
                                            {dayItems.find((item) => item.type === "event")?.title}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default AcademicCalendar
