
import type React from "react"
import { BookOpen, GraduationCap, Filter } from "lucide-react"
import { Button } from "../../../components/ui/button"
import type { SchoolEventTypes } from "../../../types/academicClaender.types"
import ConfirmModal from "../../../admin/components/modals/ConfirmDeleteModal"
import { useState } from "react"
import { useAppDispatch } from "../../../hooks/app.hooks"
import { removeEvent } from "../../../store/calenderAndEventsSlice"
import { useNotification } from "../../../context/notification/useNotification"
import EventEditModal from "./EventEditModal"
import { CustomPagination } from "../../../components/shared/CustomPagination"

interface EventsListProps {
  month: string
  scheduledEventItems: SchoolEventTypes[]
  setSelectedView: (view: "calendar" | "events") => void
}

const EventsList: React.FC<EventsListProps> = ({ month, scheduledEventItems, setSelectedView, }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [itemToRemove, setItemToRemove] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [eventToEdit, setEventToEdit] = useState<SchoolEventTypes | null>(null);
  const [currentPage,setCurrentPage] = useState(1);
  const pageSize = 5;


  const dispatch = useAppDispatch()
  const { showNotification } = useNotification()

  const filteredEvents = scheduledEventItems.filter((item) => {
    if (!item.date) return false

    const [day, monthStr, year] = item.date.split("-")
    const eventDate = new Date(Number(year), Number(monthStr) - 1, Number(day))

    const eventMonth = eventDate.toLocaleString("default", { month: "long" })
    const eventYear = eventDate.getFullYear()

    return `${eventMonth} ${eventYear}` === month && item.type === "event"
  }).sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('-');
    const [dayB, monthB, yearB] = b.date.split('-');
    const dateA = new Date(Number(yearA), Number(monthA) - 1, Number(dayA));
    const dateB = new Date(Number(yearB), Number(monthB) - 1, Number(dayB));
    return dateA.getTime() - dateB.getTime()
  })
  const totalPages = Math.ceil(filteredEvents.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedEvents = filteredEvents.slice(start, start + pageSize)
  console.log('filtered events', filteredEvents)
  const handleRemove = async () => {
    if (!itemToRemove) return;
    try {
      await dispatch(removeEvent(itemToRemove))
      showNotification('success', { message: "Event successfully removed " })
    } catch (error) {
      showNotification('error', { message: error as string })
      setConfirmOpen(false);
      setItemToRemove(null)
    }
  }


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Events List Header */}
      <div className="bg-gradient-to-br from-gray-600 via-gray-500 to-white backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <span className="hidden sm:inline">School Events - {month}</span>
            <span className="sm:hidden">Events - {month.split(" ")[0]}</span>
          </h2>

        </div>



        {/* Events Count */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            <Filter className="w-4 h-4" />
            {filteredEvents.length} Event{filteredEvents.length !== 1 ? "s" : ""} Found
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-3 sm:gap-4">
          {paginatedEvents.map((item) => {
            const day = item.date.split(" ")[0]
            return (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl border-l-4 bg-gradient-to-br from-white via-gray-500 to-white shadow-sm hover:shadow-md transition-all duration-300 border-l-blue-500"
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-0">
                  {/* Date Circle */}
                  <div className=" p-2 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-sm sm:text-lg bg-blue-100 text-blue-700 flex-shrink-0">
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
                    <p className="text-green-300 text-xs sm:text-sm ">Date: {item.date}</p>
                    <p className=" text-red-300 text-xs sm:text-sm">End Date: {item.endDate}</p>


                  </div>

                  {/* Poster Preview */}
                  {item.posterUrl && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 self-end sm:self-center">
                  <Button
                    onClick={() => { setEventToEdit(item); setEditOpen(true) }}
                    variant="outline" size="sm" className="h-8 px-3 text-xs sm:text-sm bg-gray-500">
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs sm:text-sm text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                    onClick={() => {
                      setItemToRemove(item._id as string)
                      setConfirmOpen(true)
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )
          })}

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <GraduationCap className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                {filteredEvents ? "No events found" : "No events scheduled"}
              </h3>
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
      {confirmOpen && (
        <ConfirmModal
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleRemove}
          open={confirmOpen}
          title="Remove Event?"
          description="This action cannot be undone. Do you want to proceed?"
        />
      )}
      {editOpen && eventToEdit && (
        <EventEditModal
          isOpen={editOpen}
          onClose={() => {
            setEditOpen(false)
            setEventToEdit(null)
          }}
          selectedDate={null}
          initialData={{
            _id: eventToEdit._id,
            title: eventToEdit.title,
            description: eventToEdit.description || "",
            date: eventToEdit.date,
            endDate: eventToEdit.endDate,
            venue: eventToEdit.venue || "",
            posterUrl: eventToEdit.posterUrl,
            type: 'event'
          }}
        />
      )}
      {filteredEvents.length > 0 && (
        <div className="mt-8">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

    </div>
  )
}

export default EventsList
