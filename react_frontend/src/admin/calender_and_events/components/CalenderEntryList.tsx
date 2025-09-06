import React, { useState } from 'react';
import { Calendar, Clock, Users, Filter, Edit2, Trash2, Eye, ChevronDown } from 'lucide-react';
import type { CalendarTypeEnums, CalenderEntries } from '../../../types/academicClaender.types';
import type { Division } from '../../../types/division.type';

interface CalenderEntryProps {
  month: string;
  calenderEntries: CalenderEntries[];
  classDivisions: Division[]
}

const CalenderEntryList: React.FC<CalenderEntryProps> = ({ calenderEntries, classDivisions }) => {
  const [entries] = useState<CalenderEntries[]>(calenderEntries);
  const [typeFilter, setTypeFilter] = useState<CalendarTypeEnums | 'all'>('all');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  // Type color mapping with enhanced colors
  const getTypeColor = (type: CalendarTypeEnums) => {
    const colors = {
      exam: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border border-red-200 shadow-red-100',
      holiday: 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border border-emerald-200 shadow-emerald-100',
      event: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200 shadow-blue-100',
      off_day: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border border-orange-200 shadow-orange-100'
    };
    return colors[type];
  };

  // Type icons
  const getTypeIcon = (type: CalendarTypeEnums) => {
    const icons = {
      exam: '📝',
      holiday: '🏖️',
      event: '🎉',
      off_day: '🚫'
    };
    return icons[type];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isMultiDay = (entry: CalenderEntries) => {
    return entry.date !== entry.endDate;
  };

  const getClassDivisionName = (id: string) => {
    return classDivisions.find((item) => item._id === id)?.divisionName
  }

  const toggleExpanded = (entryId: string) => {
    const newExpanded = new Set(expandedEntries);
    if (newExpanded.has(entryId)) {
      newExpanded.delete(entryId);
    } else {
      newExpanded.add(entryId);
    }
    setExpandedEntries(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with glassmorphism effect */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-white/70 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  Calendar Entries
                </h1>
                <p className="text-slate-600 mt-3 text-lg">Manage and view all calendar events, exams, holidays, and off days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 z-10" />
              <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 z-10 pointer-events-none" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as CalendarTypeEnums | 'all')}
                className="w-full pl-12 pr-12 py-3 bg-gradient-to-r from-slate-50 to-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 appearance-none font-medium text-slate-700 shadow-sm hover:shadow-md"
              >
                <option value="all">All Types</option>
                <option value="exam">📝 Exams</option>
                <option value="holiday">🏖️ Holidays</option>
                <option value="event">🎉 Events</option>
                <option value="off_day">🚫 Off Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Enhanced Results Summary */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-4 border border-blue-200/50">
            <p className="text-slate-700 font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Showing <span className="font-bold text-blue-600">{entries.length}</span> of <span className="font-bold text-purple-600">{entries.length}</span> entries
            </p>
          </div>
        </div>

        {/* Enhanced Entries List */}
        <div className="space-y-6">
          {entries.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">No entries found</h3>
              <p className="text-slate-600 text-lg">Try adjusting your search criteria or add a new entry.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div 
                key={entry._id} 
                className="group bg-white/80 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl border border-white/30 overflow-hidden transform hover:scale-[1.02]"
              >
                {/* Card Header with gradient accent */}
                <div className={`h-2 ${getTypeColor(entry.type).includes('red') ? 'bg-gradient-to-r from-red-400 to-red-500' : 
                  getTypeColor(entry.type).includes('emerald') ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                  getTypeColor(entry.type).includes('blue') ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                  'bg-gradient-to-r from-orange-400 to-orange-500'}`}>
                </div>
                
                <div className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                          {entry.title}
                        </h3>
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${getTypeColor(entry.type)} flex items-center gap-2`}>
                          <span>{getTypeIcon(entry.type)}</span>
                          {entry.type.charAt(0).toUpperCase() + entry.type.slice(1).replace('_', ' ')}
                        </span>
                      </div>

                      {entry.description && (
                        <div className="bg-slate-50/80 rounded-2xl p-4 mb-6 border border-slate-100">
                          <p className="text-slate-700 leading-relaxed">{entry.description}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600">
                        {/* Date Information */}
                        <div className="flex items-center gap-3 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                          <div className="p-2 bg-blue-500 rounded-lg">
                            <Clock className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">Date</p>
                            <p className="font-semibold text-slate-800">
                              {formatDate(entry.date)}
                              {isMultiDay(entry) && (
                                <>
                                  <span className="mx-2 text-slate-400">→</span>
                                  {formatDate(entry.endDate)}
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Class Divisions */}
                        <div className="flex items-center gap-3 bg-purple-50/50 rounded-xl p-4 border border-purple-100">
                          <div className="p-2 bg-purple-500 rounded-lg">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Classes</p>
                            <p className="font-semibold text-slate-800 truncate">
                              {entry.applicableClassDivisions.length > 3
                                ? `${entry.applicableClassDivisions
                                  .slice(0, 2)
                                  .map(id => getClassDivisionName(id))
                                  .join(', ')} +${entry.applicableClassDivisions.length - 2} more`
                                : entry.applicableClassDivisions
                                  .map(id => getClassDivisionName(id))
                                  .join(', ')
                              }
                            </p>
                          </div>
                        </div>
                      </div>

                      {entry.academicYear && (
                        <div className="mt-6 inline-flex items-center gap-2 bg-amber-50/80 text-amber-800 px-4 py-2 rounded-full border border-amber-200">
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                          <span className="text-sm font-medium">Academic Year: {entry.academicYear}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 ml-6">
                      <button
                        className="group/btn p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button
                        className="group/btn p-3 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-110"
                        title="Edit Entry"
                      >
                        <Edit2 className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button
                        className="group/btn p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-110"
                        title="Delete Entry"
                      >
                        <Trash2 className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8">
          <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110">
            <Calendar className="h-6 w-6 group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalenderEntryList;