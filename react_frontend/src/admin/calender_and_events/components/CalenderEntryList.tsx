import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Filter, Edit2, Trash2, Eye } from 'lucide-react';
import type { CalendarTypeEnums, CalenderEntries } from '../../../types/academicClaender.types';

interface CalenderEntryProps{
    month:string;
    calenderEntries:CalenderEntries[]
}

const CalenderEntryList: React.FC<CalenderEntryProps> = ({calenderEntries}) => {
  const [entries] = useState<CalenderEntries[]>(calenderEntries);
  const [typeFilter, setTypeFilter] = useState<CalendarTypeEnums | 'all'>('all');

  // Type color mapping
  const getTypeColor = (type: CalendarTypeEnums) => {
    const colors = {
      exam: 'bg-red-100 text-red-800 border-red-200',
      holiday: 'bg-green-100 text-green-800 border-green-200',
      event: 'bg-blue-100 text-blue-800 border-blue-200',
      off_day: 'bg-red-400 text-gray-800 border-gray-200'
    };
    return colors[type];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Check if entry spans multiple days
  const isMultiDay = (entry: CalenderEntries) => {
    return entry.date !== entry.endDate;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-600 via-gray-500 to-white backdrop-blur-sm rounded-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="h-8 w-8 text-blue-600" />
                Calendar Entries
              </h1>
              <p className="text-gray-400 mt-1">Manage and view all calendar events, exams, holidays, and off days</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as CalendarTypeEnums | 'all')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Types</option>
                <option value="exam">Exams</option>
                <option value="holiday">Holidays</option>
                <option value="event">Events</option>
                <option value="off_day">Off Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4 ">
          <p className="text-gray-300 ">
            Showing {entries.length} of {entries.length} entries
          </p>
        </div>

        {/* Entries List */}
        <div className="space-y-4 ">
          {entries.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No entries found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or add a new entry.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry._id} className="bg-gradient-to-br from-white via-gray-500 to-white shadow-sm hover:shadow-md transition-all duration-300 rounded-lg border border-gray-200 p-6 ">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{entry.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(entry.type)}`}>
                        {entry.type.charAt(0).toUpperCase() + entry.type.slice(1)}
                      </span>
                    </div>
                    
                    {entry.description && (
                      <p className="text-gray-600 mb-3">{entry.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {formatDate(entry.date)}
                          {isMultiDay(entry) && ` - ${formatDate(entry.endDate)}`}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{entry.venue}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {entry.applicableClassDivisions.length > 3 
                            ? `${entry.applicableClassDivisions.slice(0, 2).join(', ')} +${entry.applicableClassDivisions.length - 2} more`
                            : entry.applicableClassDivisions.join(', ')
                          }
                        </span>
                      </div>
                    </div>
                    
                    {entry.academicYear && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">Academic Year: {entry.academicYear}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit Entry"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalenderEntryList;