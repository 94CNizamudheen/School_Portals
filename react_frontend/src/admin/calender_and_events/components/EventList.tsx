

import type React from "react"
import { useState } from "react"
import { BookOpen, GraduationCap, Plus, Filter } from "lucide-react"
import { Button } from "../../../components/ui/button"

interface ScheduleItem {
  id: number
  date: string
  type: "holiday" | "off_day" | "event"
  title: string
  description?: string
  poster?: File | null
}

interface EventsListProps {
  month: string
  scheduleItems: ScheduleItem[]
  getItemTypeInfo: (type: "holiday" | "off_day" | "event") => { bg: string; color: string; label: string }
  setItemToRemove: (item: ScheduleItem) => void
  setConfirmRemoveOpen: (val: boolean) => void
  setSelectedView: (view: "calendar" | "events") => void
}

const EventsList: React.FC<EventsListProps> = ({
  month,
  scheduleItems,
  setItemToRemove,
  setConfirmRemoveOpen,
  setSelectedView,
}) => {
  const filteredEvents = scheduleItems.filter((item) => item.date.includes(month) && item.type === "event")

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"date" | "title">("date")

  // Filter events by search term
  const searchedEvents = filteredEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Sort events
  const sortedEvents = searchedEvents.sort((a, b) => {
    if (sortBy === "date") {
      const dayA = Number.parseInt(a.date.split(" ")[0])
      const dayB = Number.parseInt(b.date.split(" ")[0])
      return dayA - dayB
    } else {
      return a.title.localeCompare(b.title)
    }
  })

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Events List Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span className="hidden sm:inline">School Events - {month}</span>
            <span className="sm:hidden">Events - {month.split(" ")[0]}</span>
          </h2>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const exportEvents = filteredEvents
                console.log("Export Events:", exportEvents)
              }}
              className="flex items-center gap-2 text-xs sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              Export Events
            </Button>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date" | "title")}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Events Count */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            <Filter className="w-4 h-4" />
            {sortedEvents.length} Event{sortedEvents.length !== 1 ? "s" : ""} Found
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-3 sm:gap-4">
          {sortedEvents.map((item) => {
            const day = item.date.split(" ")[0]

            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl border-l-4 bg-white shadow-sm hover:shadow-md transition-all duration-300 border-l-blue-500"
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
                  {/* Date Circle */}
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-sm sm:text-lg bg-blue-100 text-blue-700 flex-shrink-0">
                    {day}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-200 text-blue-800">
                        School Event
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1 break-words">{item.title}</h3>
                    {item.description && <p className="text-gray-600 text-sm mb-2 break-words">{item.description}</p>}
                    <p className="text-gray-500 text-xs sm:text-sm">{item.date}</p>
                  </div>

                  {/* Poster Preview */}
                  {item.poster && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs sm:text-sm bg-transparent">
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs sm:text-sm text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                    onClick={() => {
                      setItemToRemove(item)
                      setConfirmRemoveOpen(true)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}

          {/* Empty State */}
          {sortedEvents.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "No events found" : "No events scheduled"}
              </h3>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                {searchTerm
                  ? `No events match "${searchTerm}" for ${month}.`
                  : `No school events are scheduled for ${month}.`}
              </p>
              <Button
                onClick={() => setSelectedView("calendar")}
                className="bg-blue-600 hover:bg-blue-700 text-sm sm:text-base"
              >
                Go to Calendar to Add Events
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventsList
