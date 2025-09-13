import React, { useState, useEffect } from 'react';
import { Save, Calendar, GraduationCap, AlertCircle, CheckCircle, BarChart3, Users, Building } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../hooks/app.hooks';
// import { useNotification } from '../../../context/notification/useNotification';
import { fetchAllDivisions } from '../../../store/divisionThunks';
import { fetchTeachers } from '../../../store/teacherSlice';
import { fetchSubjects } from '../../../store/subjectThunks';
import type { Teacher } from '../../../types/teacher.types';
import type { Subject } from '../../../types/subject.types';
import type { Division } from '../../../types/division.type';
import DivisionTimetable from '../components/DivisionTimetable';

export interface TimeSlot {
  id: string;
  subject: string;
  teacher: string;
  teacherId?: string;
  startTime: string;
  endTime: string;
  day: string;
  color: string;
  grade: string;
  division: string;
}

interface GradeProgress {
  grade: string;
  division: string;
  totalSlots: number;
  filledSlots: number;
  missingSubjects: string[];
  completionPercentage: number;
}

interface EditingCell {
  day: string;
  time: string;
  slot?: TimeSlot;
}

const WeeklyTimetable: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [currentDivisionId, setCurrentDivisionId] = useState<string>('');
  const [showGuidance, setShowGuidance] = useState(true);

  // Inline editing states
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('');

  const dispatch = useAppDispatch();
  // const { showNotifications } = useNotification();

  const teachers = useAppSelector((state) => state.teacher.approved) as Teacher[];
  const subjects = useAppSelector((state) => state.subjects.subjects) as Subject[];
  const classDivisions = useAppSelector((state) => state.divisions.divisions) as Division[];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlotsList = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  // Initialize with first division when data loads
  useEffect(() => {
    if (classDivisions.length > 0 && !currentDivisionId) {
      setCurrentDivisionId(classDivisions[0]._id);
    }
  }, [classDivisions, currentDivisionId]);

  // Get unique class levels for grouping
  const getUniqueClassLevels = () => {
    const levels = [...new Set(classDivisions.map(div => div.classLevel))];
    return levels.sort();
  };

  // Group divisions by class level
  const getDivisionsByLevel = (level: string) => {
    return classDivisions.filter(div => div.classLevel === level);
  };

  // Get current division data
  const getCurrentDivision = (): Division | undefined => {
    return classDivisions.find(div => div._id === currentDivisionId);
  };

  // Get current division slots
  const getCurrentDivisionSlots = () => {
    return timeSlots.filter(slot => slot.division === currentDivisionId);
  };

  // Calculate division progress
  const calculateDivisionProgress = (divisionId: string): GradeProgress => {
    const division = classDivisions.find(div => div._id === divisionId);
    const divisionSlots = timeSlots.filter(slot => slot.division === divisionId);

    if (!division) {
      return {
        grade: '',
        division: divisionId,
        totalSlots: 0,
        filledSlots: 0,
        missingSubjects: [],
        completionPercentage: 0
      };
    }

    const filledSlots = divisionSlots.length;
    const assignedSubjects = new Set(divisionSlots.map(slot => slot.subject));
    const missingSubjects = division.subjects.filter(subject => !assignedSubjects.has(subject));

    // Assume minimum 25 periods per week as baseline
    const minPeriodsPerWeek = 25;
    const completionPercentage = Math.round((filledSlots / minPeriodsPerWeek) * 100);

    return {
      grade: division.classLevel,
      division: division.divisionName,
      totalSlots: minPeriodsPerWeek,
      filledSlots,
      missingSubjects,
      completionPercentage: Math.min(completionPercentage, 100)
    };
  };

  // Get progress for all divisions of same class level
  const getSameLevelDivisionsProgress = (): GradeProgress[] => {
    const currentDiv = getCurrentDivision();
    if (!currentDiv) return [];

    const sameLevelDivisions = getDivisionsByLevel(currentDiv.classLevel);
    return sameLevelDivisions.map(division => calculateDivisionProgress(division._id));
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getNextTimeSlot = (currentTime: string): string => {
    const currentIndex = timeSlotsList.indexOf(currentTime);
    return currentIndex < timeSlotsList.length - 1 ? timeSlotsList[currentIndex + 1] : currentTime;
  };

  const getSubjectColor = (subjectName: string): string => {
    const colors = [
      '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b',
      '#ef4444', '#ec4899', '#84cc16', '#f97316', '#6b7280'
    ];
    const hash = subjectName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getSlotForDayAndTime = (day: string, time: string) => {
    return getCurrentDivisionSlots().find(slot => slot.day === day && slot.startTime === time);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get available subjects for current division
  const getAvailableSubjects = () => {
    const currentDiv = getCurrentDivision();
    if (!currentDiv) return [];

    return subjects.filter(subject =>
      currentDiv.subjects.includes(subject.name)
    );
  };

  const getAvailableTeachers = () => {
    if (!selectedSubject) return teachers;

    const selectedSubjectData = subjects.find(sub => sub.name === selectedSubject);
    if (!selectedSubjectData) return teachers;

    return teachers.filter(teacher =>
      (selectedSubjectData.assignedTeachers ?? []).includes(teacher._id)
    );
  };

  // Handle cell click for inline editing
  const handleCellClick = (day: string, time: string) => {
    const existingSlot = getSlotForDayAndTime(day, time);
    setEditingCell({ day, time, slot: existingSlot });

    if (existingSlot) {
      setSelectedSubject(existingSlot.subject);
      setSelectedTeacher(existingSlot.teacherId || existingSlot.teacher);
    } else {
      setSelectedSubject('');
      setSelectedTeacher('');
    }
  };

  // Handle save for inline editing
  const handleInlineSave = () => {
    if (!selectedSubject || !selectedTeacher || !editingCell) return;

    const currentDiv = getCurrentDivision();
    if (!currentDiv) return;

    const teacherData = teachers.find(t => t._id === selectedTeacher);
    const teacherName = teacherData?.firstName + ' ' + teacherData?.lastName || '';
    const color = getSubjectColor(selectedSubject);

    if (editingCell.slot) {
      // Edit existing slot
      setTimeSlots(prev => prev.map(slot =>
        slot.id === editingCell.slot!.id
          ? {
            ...slot,
            subject: selectedSubject,
            teacher: teacherName,
            teacherId: selectedTeacher,
            color
          }
          : slot
      ));
    } else {
      // Create new slot
      const newSlot: TimeSlot = {
        id: generateId(),
        subject: selectedSubject,
        teacher: teacherName,
        teacherId: selectedTeacher,
        startTime: editingCell.time,
        endTime: getNextTimeSlot(editingCell.time),
        day: editingCell.day,
        color,
        grade: currentDiv.classLevel,
        division: currentDivisionId,
      };
      setTimeSlots(prev => [...prev, newSlot]);
    }

    setEditingCell(null);
    setSelectedSubject('');
    setSelectedTeacher('');
  };

  // Handle cancel for inline editing
  const handleInlineCancel = () => {
    setEditingCell(null);
    setSelectedSubject('');
    setSelectedTeacher('');
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTimeSlots(prev => prev.filter(slot => slot.id !== id));
    if (editingCell?.slot?.id === id) {
      setEditingCell(null);
    }
  };

  const isEditing = (day: string, time: string) => {
    return editingCell?.day === day && editingCell?.time === time;
  };

  const currentProgress = calculateDivisionProgress(currentDivisionId);
  const allSameLevelDivisionsProgress = getSameLevelDivisionsProgress();

  useEffect(() => {
    dispatch(fetchAllDivisions()).unwrap();
    dispatch(fetchTeachers()).unwrap();
    dispatch(fetchSubjects()).unwrap();
  }, [dispatch]);

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-b from-gray-600 via-white to-gray-400 rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Monthly Timetable Manager</h1>
                <p className="text-gray-600">Click any cell to assign subject and teacher</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowGuidance(!showGuidance)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>{showGuidance ? 'Hide' : 'Show'} Progress</span>
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2">
                <Save className="w-5 h-5" />
                <span>Save All Timetables</span>
              </button>
            </div>
          </div>

          {/* Class Level & Division Selector */}
          <div className="space-y-4 ">
            {/* Class Level Selection */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Class Levels:</span>
              </div>
              <div className="flex flex-wrap gap-2 ">
                {getUniqueClassLevels().map(level => {
                  const levelDivisions = getDivisionsByLevel(level);
                  const levelProgress = levelDivisions.map(div =>
                    calculateDivisionProgress(div._id)
                  );
                  const avgCompletion = levelProgress.length > 0
                    ? levelProgress.reduce((sum, prog) => sum + prog.completionPercentage, 0) / levelProgress.length
                    : 0;

                  return (
                    <div key={level} className="flex items-center space-x-2">
                      <span className="px-3 py-2 bg-gradient-to-bl from-amber-400 to-white text-gray-700 rounded-lg font-semibold">
                        {level}
                      </span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">({levelDivisions.length} div)</span>
                        <div className={`w-2 h-2 rounded-full ${avgCompletion >= 80 ? 'bg-green-400' :
                          avgCompletion >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Division Selection */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Select Division:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {classDivisions.map(division => {
                  const divProgress = calculateDivisionProgress(division._id);
                  return (
                    <button
                      key={division._id}
                      onClick={() => setCurrentDivisionId(division._id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${currentDivisionId === division._id
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <span>{division.divisionName}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">({division.capacity})</span>
                        <div className={`w-2 h-2 rounded-full ${divProgress.completionPercentage >= 80 ? 'bg-green-400' :
                          divProgress.completionPercentage >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Guidance Panel */}
        {showGuidance && getCurrentDivision() && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Current Division Progress */}
            <div className="bg-gradient-to-tr from-gray-200 to-gray-400 rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-indigo-600" />
                {getCurrentDivision()?.divisionName} Progress
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-bold text-2xl text-indigo-600">
                    {currentProgress.completionPercentage}%
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${currentProgress.completionPercentage >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      currentProgress.completionPercentage >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                    style={{ width: `${currentProgress.completionPercentage}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{currentProgress.filledSlots}</div>
                    <div className="text-gray-600">Filled</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{currentProgress.totalSlots}</div>
                    <div className="text-gray-600">Required</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{getCurrentDivision()?.capacity}</div>
                    <div className="text-gray-600">Capacity</div>
                  </div>
                </div>

                {currentProgress.missingSubjects.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-red-700 font-semibold">Missing Subjects:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentProgress.missingSubjects.map(subject => (
                        <span key={subject} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Same Level All Divisions Overview */}
            <div className="bg-gradient-to-tr from-gray-200  to-gray-400  rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-purple-600" />
                {getCurrentDivision()?.classLevel} All Divisions
              </h3>

              <div className="space-y-3">
                {allSameLevelDivisionsProgress.map(progress => {
                  const division = classDivisions.find(div => div._id === progress.division);
                  return (
                    <div key={progress.division}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${currentDivisionId === progress.division
                        ? 'bg-purple-50 border border-purple-200'
                        : 'bg-gray-50 hover:bg-gray-100'
                        }`}>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setCurrentDivisionId(progress.division)}
                          className="font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                        >
                          {progress.division}
                        </button>
                        <div className={`w-3 h-3 rounded-full ${progress.completionPercentage >= 80 ? 'bg-green-400' :
                          progress.completionPercentage >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                        <span className="text-xs text-gray-500">({division?.capacity} students)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {progress.filledSlots}/{progress.totalSlots}
                        </span>
                        <span className="font-bold text-sm">
                          {progress.completionPercentage}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Timetable Grid */}
        {getCurrentDivision() && (
          <DivisionTimetable
            division={getCurrentDivision()}
            days={days}
            timeSlotsList={timeSlotsList}
            formatTime={formatTime}
            getNextTimeSlot={getNextTimeSlot}
            getSlotForDayAndTime={getSlotForDayAndTime}
            isEditing={isEditing}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedTeacher={selectedTeacher}
            setSelectedTeacher={setSelectedTeacher}
            getAvailableSubjects={getAvailableSubjects}
            getAvailableTeachers={getAvailableTeachers}
            handleInlineSave={handleInlineSave}
            handleInlineCancel={handleInlineCancel}
            handleCellClick={handleCellClick}
            handleDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default WeeklyTimetable;