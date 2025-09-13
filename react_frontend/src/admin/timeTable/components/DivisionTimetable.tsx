import React from "react";
import { Calendar, Clock, User, Trash2, Plus, Check, X } from "lucide-react";
import type { Subject } from "../../../types/subject.types";
import type { Teacher } from "../../../types/teacher.types";
import type { TimeSlot } from "../Pages/TimeTablePage";
import type { Division } from "../../../types/division.type";

interface DivisionTimetableProps {
    division?: Division;
    days: string[];
    timeSlotsList: string[];
    formatTime: (time: string) => string;
    getNextTimeSlot: (time: string) => string;
    getSlotForDayAndTime: (day: string, time: string) => TimeSlot | undefined;
    isEditing: (day: string, time: string) => boolean;
    selectedSubject: string;
    setSelectedSubject: (subject: string) => void;
    selectedTeacher: string;
    setSelectedTeacher: (teacher: string) => void;
    getAvailableSubjects: () => Subject[];
    getAvailableTeachers: () => Teacher[];
    handleInlineSave: () => void;
    handleInlineCancel: () => void;
    handleCellClick: (day: string, time: string) => void;
    handleDelete: (id: string, e: React.MouseEvent) => void;
}

const DivisionTimetable: React.FC<DivisionTimetableProps> = ({
    division,
    days,
    timeSlotsList,
    formatTime,
    getNextTimeSlot,
    getSlotForDayAndTime,
    isEditing,
    selectedSubject,
    setSelectedSubject,
    selectedTeacher,
    setSelectedTeacher,
    getAvailableSubjects,
    getAvailableTeachers,
    handleInlineSave,
    handleInlineCancel,
    handleCellClick,
    handleDelete,
}) => {
    return (
        <div className="bg-gradient-to-t rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <h2 className="text-xl font-bold flex items-center">
                    <Calendar className="w-6 h-6 mr-2" />
                    {division?.divisionName} Timetable
                    <span className="ml-2 text-sm opacity-80">
                        ({division?.capacity} Students)
                    </span>
                </h2>
            </div>

            {/* Table */}
            <div className="overflow-x-auto ">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-4 text-left text-gray-700 font-semibold min-w-[120px]">
                                <div className="flex items-center space-x-2">
                                    <Clock className="w-5 h-5" />
                                    <span>Time</span>
                                </div>
                            </th>
                            {days.map((day) => (
                                <th
                                    key={day}
                                    className="p-4 text-center text-gray-700 font-semibold min-w-[200px]"
                                >
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlotsList.map((time, timeIndex) => (
                            <tr
                                key={time}
                                className={timeIndex % 2 === 0 ? "bg-gray-50" : "bg-white"}
                            >
                                {/* Time Column */}
                                <td className="p-4 font-semibold text-gray-700 border-r border-gray-200">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-900">
                                            {formatTime(time)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatTime(getNextTimeSlot(time))}
                                        </div>
                                    </div>
                                </td>

                                {/* Days Columns */}
                                {days.map((day) => {
                                    const slot = getSlotForDayAndTime(day, time);
                                    const editing = isEditing(day, time);
                                    return (
                                        <td
                                            key={`${day}-${time}`}
                                            className="p-2 border-r border-gray-200 h-28"
                                        >
                                            {editing ? (
                                                // Inline editing form
                                                <div className="h-full bg-blue-50 border-2 border-blue-300 rounded-lg p-2">
                                                    <div className="space-y-2 h-full flex flex-col">
                                                        {/* Subject dropdown */}
                                                        <select
                                                            value={selectedSubject}
                                                            onChange={(e) => setSelectedSubject(e.target.value)}
                                                            className="w-full bg-gray-500 text-xs border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                        >
                                                            <option value="">Select Subject</option>
                                                            {getAvailableSubjects().map((subject) => (
                                                                <option key={subject._id} value={subject.name}>
                                                                    {subject.name}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {/* Teacher dropdown */}
                                                        <select
                                                            value={selectedTeacher}
                                                            onChange={(e) => setSelectedTeacher(e.target.value)}
                                                            className="w-full bg-gray-500 text-xs border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                            disabled={!selectedSubject}
                                                        >
                                                            <option value="">Select Teacher</option>
                                                            {getAvailableTeachers().map((teacher) => (
                                                                <option key={teacher._id} value={teacher._id}>
                                                                    {`${teacher.firstName || ""} ${teacher.lastName || ""
                                                                        }`.trim()}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {/* Action buttons */}
                                                        <div className="flex justify-between mt-auto">
                                                            <button
                                                                onClick={handleInlineSave}
                                                                disabled={!selectedSubject || !selectedTeacher}
                                                                className="flex items-center justify-center w-8 h-6 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                                            >
                                                                <Check className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                onClick={handleInlineCancel}
                                                                className="flex items-center justify-center w-8 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : slot ? (
                                                // Existing slot display
                                                <div
                                                    className="h-full rounded-lg p-3 text-white text-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer relative group"
                                                    style={{ backgroundColor: slot.color }}
                                                    onClick={() => handleCellClick(day, time)}
                                                >
                                                    <div className="font-semibold truncate">
                                                        {slot.subject}
                                                    </div>
                                                    <div className="text-xs opacity-90 truncate flex items-center mt-1">
                                                        <User className="w-3 h-3 mr-1" />
                                                        {slot.teacher}
                                                    </div>
                                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={(e) => handleDelete(slot.id, e)}
                                                            className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                // Empty slot
                                                <button
                                                    onClick={() => handleCellClick(day, time)}
                                                    className="w-full h-full bg-red-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-200 group"
                                                >
                                                    <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                                </button>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DivisionTimetable;
