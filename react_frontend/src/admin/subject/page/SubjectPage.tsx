import React, { useState } from 'react';
import { Plus, Edit, Trash2, Users, BookOpen, User, Eye } from 'lucide-react';

import AssignTeacherModal from '../components/AssignTeacherToSubject.modal';
import SubjectDetailsModal from '../components/SubjectDetailsModal';
import SubjectFormModal from '../components/SubjectFormModal';
import type { Teacher } from '../../../types/teacher.types';

interface Subject {
  _id: string;
  name: string;
  assignedTeachers: Teacher[];
  createdAt: string;
}

interface CreateSubjectForm {
  name: string;
}

const SubjectManagementPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [availableTeachers] = useState<Teacher[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [deleteConfig, setDeleteConfig] = useState<{ type: 'subject' | 'teacher', subjectId?: string, teacherId?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const [formData, setFormData] = useState<CreateSubjectForm>({
    name: '',
    code: '',
    credits: 0,
    classLevel: '',
    capacity: 0
  });

  // Utility Functions
  const getCapacityStatus = (assignedCount: number, capacity: number) => {
    const percentage = (assignedCount / capacity) * 100;
    if (percentage >= 100) return { color: "red", status: "full" };
    if (percentage >= 80) return { color: "yellow", status: "warning" };
    return { color: "green", status: "normal" };
  };

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.classLevel.includes(searchQuery);

    const matchesFilter =
      filterValue === 'all' ||
      subject.classLevel === filterValue ||
      subject.status === filterValue;

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredSubjects.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedSubjects = filteredSubjects.slice(start, start + pageSize);

  // Form Handlers
  const resetForm = () => {
    setFormData({ name: '', code: '', credits: 0, classLevel: '', capacity: 0 });
    setEditingSubject(null);
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (subject: Subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      credits: subject.credits,
      classLevel: subject.classLevel,
      capacity: subject.capacity
    });
    setEditingSubject(subject);
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
    resetForm();
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.code || !formData.credits || !formData.classLevel) {
      return;
    }

    if (editingSubject) {
      setSubjects(prev => prev.map(subject =>
        subject.id === editingSubject.id
          ? { ...subject, ...formData }
          : subject
      ));
    } else {
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...formData,
        assignedTeachers: [],
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setSubjects(prev => [...prev, newSubject]);
    }

    closeModal();
  };

  // Delete Handlers
  const handleOpenDeleteSubjectConfirm = (subjectId: string) => {
    setDeleteConfig({ type: 'subject', subjectId });
    setIsDeleteModalOpen(true);
  };

  const handleOpenRemoveTeacherConfirm = (subjectId: string, teacherId: string) => {
    setDeleteConfig({ type: 'teacher', subjectId, teacherId });
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfig) return;

    if (deleteConfig.type === 'subject' && deleteConfig.subjectId) {
      setSubjects(prev => prev.filter(subject => subject.id !== deleteConfig.subjectId));
      setIsDetailsModalOpen(false);
      setActiveSubjectId(null);
    }

    if (deleteConfig.type === 'teacher' && deleteConfig.subjectId && deleteConfig.teacherId) {
      unassignTeacher(deleteConfig.subjectId, deleteConfig.teacherId);
    }

    setIsDeleteModalOpen(false);
    setDeleteConfig(null);
  };

  // Teacher Assignment
  const assignTeacher = (subjectId: string, teacherId: string) => {
    const teacher = availableTeachers.find(t => t.id === teacherId);
    if (!teacher) return;

    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        const isAlreadyAssigned = subject.assignedTeachers.some(t => t.id === teacherId);
        if (!isAlreadyAssigned && subject.assignedTeachers.length < subject.capacity) {
          return {
            ...subject,
            assignedTeachers: [...subject.assignedTeachers, teacher]
          };
        }
      }
      return subject;
    }));
  };

  const unassignTeacher = (subjectId: string, teacherId: string) => {
    setSubjects(prev => prev.map(subject =>
      subject.id === subjectId
        ? {
          ...subject,
          assignedTeachers: subject.assignedTeachers.filter(t => t.id !== teacherId)
        }
        : subject
    ));
  };

  const getAvailableTeachersForSubject = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return availableTeachers;

    const assignedTeacherIds = subject.assignedTeachers.map(t => t.id);
    return availableTeachers.filter(t => !assignedTeacherIds.includes(t.id));
  };

  // Modal Handlers
  const openDetailsModal = (subjectId: string) => {
    setActiveSubjectId(subjectId);
    setIsDetailsModalOpen(true);
  };

  const openTeacherModal = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject && subject.assignedTeachers.length >= subject.capacity) {
      alert('Subject has reached maximum teacher capacity!');
      return;
    }
    setActiveSubjectId(subjectId);
    setIsTeacherModalOpen(true);
  };

  const getActiveSubject = () => {
    return subjects.find(s => s.id === activeSubjectId) || null;
  };

  // Statistics
  const totalSubjects = subjects.length;
  const totalTeachers = subjects.reduce((total, subject) => total + subject.assignedTeachers.length, 0);
  const atCapacity = subjects.filter(subject => subject.assignedTeachers.length >= subject.capacity).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-400 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="backdrop-blur-sm bg-white/30 rounded-3xl p-8 border border-white/10 shadow-xl">
            <div className="flex justify-between items-start mb-6 flex-col lg:flex-row gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    Subject Management
                  </h1>
                  <p className="text-gray-600 mt-1">Manage subjects, assign teachers, and organize curriculum</p>
                </div>
              </div>

              <button
                onClick={openCreateModal}
                className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-black 
                         px-8 py-4 rounded-2xl text-white font-semibold flex items-center gap-3 
                         transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                Create Subject
              </button>
            </div>
          </div>
        </div>



        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedSubjects.map((subject: Subject) => {
            const assignedCount = subject.assignedTeachers.length;
            const capacityStatus = getCapacityStatus(assignedCount, subject.capacity);

            return (
              <div
                key={subject.id}
                className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500 rounded-3xl"
              >
                {/* Status Indicator Bar */}
                <div className={`h-2 ${capacityStatus.status === "full"
                  ? "bg-gradient-to-r from-red-500 to-red-600"
                  : capacityStatus.status === "warning"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                    : "bg-gradient-to-r from-green-500 to-blue-500"
                  }`}></div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-gray-50/90 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                {/* Action Buttons */}
                <div className="absolute z-20 top-4 right-4 flex gap-2">
                  <button
                    onClick={() => openEditModal(subject)}
                    className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 
                             p-2 rounded-xl transition-all duration-300 shadow-lg opacity-80 hover:opacity-100"
                    title="Edit Subject"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDeleteSubjectConfirm(subject.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 
                             p-2 rounded-xl transition-all duration-300 shadow-lg opacity-80 hover:opacity-100"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Subject Header */}
                <div className="relative z-10 p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                          {subject.name}
                        </h2>

                      </div>
                    </div>

                  </div>


                </div>

                {/* Content Section */}
                <div className="relative z-10 px-6 pb-6 space-y-4">
              
                  {subject.assignedTeachers.length > 0 && (
                    <div className="bg-gray-50/80 rounded-2xl p-4">
                      <p className="text-xs font-medium text-gray-500 mb-3">Assigned Teachers</p>
                      <div className="space-y-2">
                        {subject.assignedTeachers.slice(0, 2).map((teacher, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 truncate">{teacher.name}</span>
                          </div>
                        ))}
                        {subject.assignedTeachers.length > 2 && (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{subject.assignedTeachers.length - 2}</span>
                            </div>
                            <span className="text-sm text-gray-500">more teachers</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => openDetailsModal(subject.id)}
                      className="flex-1 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-black
                               rounded-2xl p-3 flex items-center justify-center gap-2 transition-all duration-300
                               text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                    <button
                      onClick={() => openTeacherModal(subject.id)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                               rounded-2xl p-3 flex items-center justify-center gap-2 transition-all duration-300
                               text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-sm"
                    >
                      <Users className="w-4 h-4" />
                      Assign
                    </button>
                  </div>
                </div>


                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </div>
            );
          })}

          {/* Empty State */}
          {subjects.length === 0 && (
            <div className="col-span-full">
              <div className="backdrop-blur-sm bg-white/30 rounded-3xl p-12 border border-white/20 shadow-xl text-center">
                <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">No Subjects Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Get started by creating your first subject to organize teachers and curriculum efficiently.
                </p>
                <button
                  onClick={openCreateModal}
                  className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-black 
                           px-8 py-4 rounded-2xl text-white font-semibold flex items-center gap-3 mx-auto
                           transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Subject
                </button>
              </div>
            </div>
          )}
        </div>

        <SubjectFormModal
          isOpen={isCreateModalOpen}
          editingSubject={!!editingSubject}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          closeModal={() => setIsCreateModalOpen(false)}
        />

        <SubjectDetailsModal
          isOpen={isDetailsModalOpen}
          subject={getActiveSubject()}
          onClose={() => setIsDetailsModalOpen(false)}
          openTeacherModal={openTeacherModal}
          handleOpenRemoveTeacherConfirm={handleOpenRemoveTeacherConfirm}
        />
        <AssignTeacherModal
          isOpen={isTeacherModalOpen}
          activeSubjectId={activeSubjectId}
          getAvailableTeachersForSubject={getAvailableTeachersForSubject}
          assignTeacher={assignTeacher}
          onClose={() => {
            setIsTeacherModalOpen(false);
            setActiveSubjectId(null);
          }}
        />


      </div>
    </div>
  );
};

export default SubjectManagementPage;