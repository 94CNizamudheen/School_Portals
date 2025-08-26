

import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, Clock, User, Calendar, X, GraduationCap, AlertCircle, CheckCircle, BarChart3, Users, Building } from 'lucide-react';

interface TimeSlot {
  id: string;
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  day: string;
  color: string;
  grade: string;
  division: string;
}

interface Subject {
  id: string;
  name: string;
  color: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface Grade {
  id: string;
  name: string;
  level: string;
  requiredSubjects: string[];
  minPeriodsPerWeek: number;
  divisions: Division[];
}

interface Division {
  id: string;
  name: string;
  capacity: number;
}

interface GradeProgress {
  grade: string;
  division: string;
  totalSlots: number;
  filledSlots: number;
  missingSubjects: string[];
  completionPercentage: number;
}

const WeeklyTimetable: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [currentGrade, setCurrentGrade] = useState<string>('grade-6');
  const [currentDivision, setCurrentDivision] = useState<string>('');
  const [showGuidance, setShowGuidance] = useState(true);
  
  const [grades] = useState<Grade[]>([
    { 
      id: 'grade-6', 
      name: 'Grade 6', 
      level: 'Middle School', 
      requiredSubjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art'], 
      minPeriodsPerWeek: 25,
      divisions: [
        { id: 'A', name: 'A', capacity: 35 },
        { id: 'B', name: 'B', capacity: 35 },
        { id: 'C', name: 'C', capacity: 30 }
      ]
    },
    { 
      id: 'grade-7', 
      name: 'Grade 7', 
      level: 'Middle School', 
      requiredSubjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art', 'PE'], 
      minPeriodsPerWeek: 28,
      divisions: [
        { id: 'A', name: 'A', capacity: 35 },
        { id: 'B', name: 'B', capacity: 35 }
      ]
    },
    { 
      id: 'grade-8', 
      name: 'Grade 8', 
      level: 'Middle School', 
      requiredSubjects: ['Mathematics', 'English', 'Science', 'Social Studies', 'Art', 'PE'], 
      minPeriodsPerWeek: 28,
      divisions: [
        { id: 'A', name: 'A', capacity: 35 },
        { id: 'B', name: 'B', capacity: 35 },
        { id: 'C', name: 'C', capacity: 30 }
      ]
    },
    { 
      id: 'grade-9', 
      name: 'Grade 9', 
      level: 'High School', 
      requiredSubjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History'], 
      minPeriodsPerWeek: 30,
      divisions: [
        { id: 'A', name: 'A', capacity: 40 },
        { id: 'B', name: 'B', capacity: 40 },
        { id: 'C', name: 'C', capacity: 35 },
        { id: 'D', name: 'D', capacity: 35 }
      ]
    },
    { 
      id: 'grade-10', 
      name: 'Grade 10', 
      level: 'High School', 
      requiredSubjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History'], 
      minPeriodsPerWeek: 30,
      divisions: [
        { id: 'A', name: 'A', capacity: 40 },
        { id: 'B', name: 'B', capacity: 40 },
        { id: 'C', name: 'C', capacity: 35 }
      ]
    },
    { 
      id: 'grade-11', 
      name: 'Grade 11', 
      level: 'Senior School', 
      requiredSubjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Economics'], 
      minPeriodsPerWeek: 32,
      divisions: [
        { id: 'A', name: 'A (Science)', capacity: 35 },
        { id: 'B', name: 'B (Commerce)', capacity: 35 },
        { id: 'C', name: 'C (Arts)', capacity: 30 }
      ]
    },
    { 
      id: 'grade-12', 
      name: 'Grade 12', 
      level: 'Senior School', 
      requiredSubjects: ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Economics'], 
      minPeriodsPerWeek: 32,
      divisions: [
        { id: 'A', name: 'A (Science)', capacity: 35 },
        { id: 'B', name: 'B (Commerce)', capacity: 35 }
      ]
    },
  ]);

  const [subjects] = useState<Subject[]>([
    { id: '1', name: 'Mathematics', color: '#3B82F6' },
    { id: '2', name: 'Physics', color: '#10B981' },
    { id: '3', name: 'Chemistry', color: '#F59E0B' },
    { id: '4', name: 'Biology', color: '#EF4444' },
    { id: '5', name: 'English', color: '#8B5CF6' },
    { id: '6', name: 'History', color: '#F97316' },
    { id: '7', name: 'Science', color: '#06B6D4' },
    { id: '8', name: 'Social Studies', color: '#84CC16' },
    { id: '9', name: 'Art', color: '#EC4899' },
    { id: '10', name: 'PE', color: '#6366F1' },
    { id: '11', name: 'Economics', color: '#14B8A6' },
  ]);
  
  const [teachers] = useState<Teacher[]>([
    { id: '1', name: 'Dr. Smith' },
    { id: '2', name: 'Prof. Johnson' },
    { id: '3', name: 'Ms. Davis' },
    { id: '4', name: 'Mr. Wilson' },
    { id: '5', name: 'Dr. Brown' },
    { id: '6', name: 'Ms. Anderson' },
    { id: '7', name: 'Mr. Taylor' },
    { id: '8', name: 'Dr. Martinez' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    startTime: '',
    endTime: '',
    day: '',
    grade: '',
    division: '',
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlotsList = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  // Initialize currentDivision when currentGrade changes
  useEffect(() => {
    const grade = grades.find(g => g.id === currentGrade);
    if (grade && grade.divisions.length > 0) {
      setCurrentDivision(grade.divisions[0].id);
    }
  }, [currentGrade, grades]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const getCurrentGradeDivisionSlots = () => {
    return timeSlots.filter(slot => slot.grade === currentGrade && slot.division === currentDivision);
  };

  const calculateDivisionProgress = (gradeId: string, divisionId: string): GradeProgress => {
    const divisionSlots = timeSlots.filter(slot => slot.grade === gradeId && slot.division === divisionId);
    const grade = grades.find(g => g.id === gradeId);
    const filledSlots = divisionSlots.length;
    
    if (!grade) {
      return { grade: gradeId, division: divisionId, totalSlots: 0, filledSlots: 0, missingSubjects: [], completionPercentage: 0 };
    }

    const assignedSubjects = new Set(divisionSlots.map(slot => slot.subject));
    const missingSubjects = grade.requiredSubjects.filter(subject => !assignedSubjects.has(subject));
    
    const completionPercentage = Math.round((filledSlots / grade.minPeriodsPerWeek) * 100);

    return {
      grade: gradeId,
      division: divisionId,
      totalSlots: grade.minPeriodsPerWeek,
      filledSlots,
      missingSubjects,
      completionPercentage: Math.min(completionPercentage, 100)
    };
  };

//   const getAllDivisionsProgress = (): GradeProgress[] => {
//     const allProgress: GradeProgress[] = [];
//     grades.forEach(grade => {
//       grade.divisions.forEach(division => {
//         allProgress.push(calculateDivisionProgress(grade.id, division.id));
//       });
//     });
//     return allProgress;
//   };

  const getCurrentGradeDivisionsProgress = (): GradeProgress[] => {
    const currentGradeData = grades.find(g => g.id === currentGrade);
    if (!currentGradeData) return [];
    
    return currentGradeData.divisions.map(division => 
      calculateDivisionProgress(currentGrade, division.id)
    );
  };

  const openModal = (day: string, timeSlot: string) => {
    setFormData({
      subject: '',
      teacher: '',
      startTime: timeSlot,
      endTime: getNextTimeSlot(timeSlot),
      day: day,
      grade: currentGrade,
      division: currentDivision,
    });
    setEditingSlot(null);
    setIsModalOpen(true);
  };

  const openEditModal = (slot: TimeSlot) => {
    setFormData({
      subject: slot.subject,
      teacher: slot.teacher,
      startTime: slot.startTime,
      endTime: slot.endTime,
      day: slot.day,
      grade: slot.grade,
      division: slot.division,
    });
    setEditingSlot(slot);
    setIsModalOpen(true);
  };

  const getNextTimeSlot = (currentTime: string): string => {
    const currentIndex = timeSlotsList.indexOf(currentTime);
    return currentIndex < timeSlotsList.length - 1 ? timeSlotsList[currentIndex + 1] : currentTime;
  };

//   const getSubjectColor = (subjectName: string): string => {
//     const subject = subjects.find(s => s.name === subjectName);
//     return subject ? subject.color : '#6B7280';
//   };

  const handleSave = () => {
    if (!formData.subject || !formData.teacher || !formData.grade || !formData.division) return;

    const selectedSubject = subjects.find(s => s.name === formData.subject);
    const color = selectedSubject ? selectedSubject.color : '#6B7280';

    if (editingSlot) {
      setTimeSlots(prev => prev.map(slot => 
        slot.id === editingSlot.id 
          ? { ...slot, ...formData, color }
          : slot
      ));
    } else {
      const newSlot: TimeSlot = {
        id: generateId(),
        ...formData,
        color,
      };
      setTimeSlots(prev => [...prev, newSlot]);
    }

    setIsModalOpen(false);
    setFormData({ subject: '', teacher: '', startTime: '', endTime: '', day: '', grade: '', division: '' });
  };

  const handleDelete = (id: string) => {
    setTimeSlots(prev => prev.filter(slot => slot.id !== id));
  };

  const getSlotForDayAndTime = (day: string, time: string) => {
    return getCurrentGradeDivisionSlots().find(slot => slot.day === day && slot.startTime === time);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getAvailableSubjects = () => {
    const currentGradeData = grades.find(g => g.id === currentGrade);
    return subjects.filter(subject => 
      currentGradeData?.requiredSubjects.includes(subject.name)
    );
  };

  const getCurrentGrade = () => grades.find(g => g.id === currentGrade);
  const getCurrentDivision = () => getCurrentGrade()?.divisions.find(d => d.id === currentDivision);

  const currentProgress = calculateDivisionProgress(currentGrade, currentDivision);
  const allCurrentGradeDivisionsProgress = getCurrentGradeDivisionsProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Weekly Timetable Manager</h1>
                <p className="text-gray-600">Create and manage timetables for all grades and divisions</p>
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

          {/* Grade & Division Selector */}
          <div className="space-y-4">
            {/* Grade Selection */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-gray-600" />
                <span className="font-semibold text-gray-700">Grade:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {grades.map(grade => {
                  const gradeProgress = grade.divisions.map(div => 
                    calculateDivisionProgress(grade.id, div.id)
                  );
                  const avgCompletion = gradeProgress.reduce((sum, prog) => sum + prog.completionPercentage, 0) / gradeProgress.length;
                  
                  return (
                    <button
                      key={grade.id}
                      onClick={() => setCurrentGrade(grade.id)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                        currentGrade === grade.id
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{grade.name}</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs">({grade.divisions.length})</span>
                        <div className={`w-2 h-2 rounded-full ${
                          avgCompletion >= 80 ? 'bg-green-400' :
                          avgCompletion >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Division Selection */}
            {getCurrentGrade() && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-gray-600" />
                  <span className="font-semibold text-gray-700">Division:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {getCurrentGrade()!.divisions.map(division => {
                    const divProgress = calculateDivisionProgress(currentGrade, division.id);
                    return (
                      <button
                        key={division.id}
                        onClick={() => setCurrentDivision(division.id)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                          currentDivision === division.id
                            ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{getCurrentGrade()!.name}-{division.name}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs">({division.capacity})</span>
                          <div className={`w-2 h-2 rounded-full ${
                            divProgress.completionPercentage >= 80 ? 'bg-green-400' :
                            divProgress.completionPercentage >= 50 ? 'bg-yellow-400' : 'bg-red-400'
                          }`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Progress Guidance Panel */}
        {showGuidance && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Current Division Progress */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2 text-indigo-600" />
                {getCurrentGrade()?.name}-{getCurrentDivision()?.name} Progress
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
                    className={`h-3 rounded-full transition-all duration-500 ${
                      currentProgress.completionPercentage >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
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

            {/* Current Grade All Divisions Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-purple-600" />
                {getCurrentGrade()?.name} All Divisions
              </h3>
              
              <div className="space-y-3">
                {allCurrentGradeDivisionsProgress.map(progress => {
                  const division = getCurrentGrade()?.divisions.find(d => d.id === progress.division);
                  return (
                    <div key={progress.division} 
                         className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                           currentDivision === progress.division 
                             ? 'bg-purple-50 border border-purple-200' 
                             : 'bg-gray-50 hover:bg-gray-100'
                         }`}>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setCurrentDivision(progress.division)}
                          className="font-semibold text-gray-900 hover:text-purple-600 transition-colors"
                        >
                          {getCurrentGrade()?.name}-{division?.name}
                        </button>
                        <div className={`w-3 h-3 rounded-full ${
                          progress.completionPercentage >= 80 ? 'bg-green-400' :
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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              {getCurrentGrade()?.name}-{getCurrentDivision()?.name} Timetable
              <span className="ml-2 text-sm opacity-80">({getCurrentDivision()?.capacity} Students)</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left text-gray-700 font-semibold min-w-[120px]">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5" />
                      <span>Time</span>
                    </div>
                  </th>
                  {days.map(day => (
                    <th key={day} className="p-4 text-center text-gray-700 font-semibold min-w-[160px]">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlotsList.map((time, timeIndex) => (
                  <tr key={time} className={timeIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-4 font-semibold text-gray-700 border-r border-gray-200">
                      <div className="text-center">
                        <div className="text-sm text-gray-900">{formatTime(time)}</div>
                        <div className="text-xs text-gray-500">
                          {formatTime(getNextTimeSlot(time))}
                        </div>
                      </div>
                    </td>
                    {days.map(day => {
                      const slot = getSlotForDayAndTime(day, time);
                      return (
                        <td key={`${day}-${time}`} className="p-2 border-r border-gray-200 h-24">
                          {slot ? (
                            <div
                              className="h-full rounded-lg p-3 text-white text-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer relative group"
                              style={{ backgroundColor: slot.color }}
                              onClick={() => openEditModal(slot)}
                            >
                              <div className="font-semibold truncate">{slot.subject}</div>
                              <div className="text-xs opacity-90 truncate flex items-center mt-1">
                                <User className="w-3 h-3 mr-1" />
                                {slot.teacher}
                              </div>
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(slot.id);
                                  }}
                                  className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => openModal(day, time)}
                              className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 transition-all duration-200 group"
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

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Edit3 className="w-6 h-6 mr-2" />
                    {editingSlot ? 'Edit Class' : 'Add New Class'}
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Grade</label>
                    <select
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value, division: '' })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select Grade</option>
                      {grades.map(grade => (
                        <option key={grade.id} value={grade.id}>
                          {grade.name} - {grade.level}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Division</label>
                    <select
                      value={formData.division}
                      onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      disabled={!formData.grade}
                    >
                      <option value="">Select Division</option>
                      {formData.grade && grades.find(g => g.id === formData.grade)?.divisions.map(division => (
                        <option key={division.id} value={division.id}>
                          {grades.find(g => g.id === formData.grade)?.name}-{division.name} (Capacity: {division.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select Subject</option>
                      {getAvailableSubjects().map(subject => (
                        <option key={subject.id} value={subject.name}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Teacher</label>
                    <select
                      value={formData.teacher}
                      onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map(teacher => (
                        <option key={teacher.id} value={teacher.name}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                      <select
                        value={formData.startTime}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          startTime: e.target.value,
                          endTime: getNextTimeSlot(e.target.value)
                        })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      >
                        {timeSlotsList.map(time => (
                          <option key={time} value={time}>
                            {formatTime(time)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                      <select
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      >
                        {timeSlotsList.map(time => (
                          <option key={time} value={time}>
                            {formatTime(time)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Day</label>
                    <select
                      value={formData.day}
                      onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    >
                      {days.map(day => (
                        <option key={day} value={day}>
                          {day}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 mt-8">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!formData.subject || !formData.teacher || !formData.grade || !formData.division}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                  >
                    {editingSlot ? 'Update' : 'Add'} Class
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyTimetable;