import React, { useState } from "react";
import type { Teacher } from "../../../types/teacher.types";
import type { CreateDivisionForm } from "../pages/ClassAndDivisionPage";
import { BookOpen, ChevronDown, GraduationCap, Plus, User, X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: CreateDivisionForm) => void;
    availableTeachers: Teacher[];
}

const CreateDivisionModal: React.FC<ModalProps> = ({ isOpen,  onClose,   onSubmit,   availableTeachers}) => {
    const [formData, setFormData] = useState<CreateDivisionForm>({
        divisionName: "",
        subjects: [],
        classTeacherId: ""
    });
    const [subjectInput, setSubjectInput] = useState("");
      const [selectedSubject, setSelectedSubject] = useState('');

    const handleSubmit = () => {
        if (formData.divisionName && formData.classTeacherId) {
            onSubmit(formData);
            setFormData({ divisionName: "", subjects: [], classTeacherId: "" });
            setSubjectInput("");
            onClose();
        }
    };

    const addSubject = () => {
        if (
            subjectInput.trim() &&
            !formData.subjects.includes(subjectInput.trim())
        ) {
            setFormData((prev) => ({
                ...prev,
                subjects: [...prev.subjects, subjectInput.trim()]
            }));
            setSubjectInput("");
        }
    };

    const removeSubject = (subject: string) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.filter((s) => s !== subject)
        }));
    };
    const availableSubjects = [
    'Mathematics',
    'Malayalam',
    'Arabic',
    'English Literature',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Geography',
    'Computer Science',
    'Art & Design',
    'Physical Education',
    'Music',
    'Economics',
    'Psychology',
    'Philosophy'
  ];

    if (!isOpen) return null;
    return (
    <div className="fixed inset-0 z-50 overflow-hidden">
   
      {/* Modal Container */}
      <div className="flex items-center justify-center min-h-full p-4 animate-in fade-in duration-300">
        <div className="relative  max-w-md transform animate-in zoom-in-95 duration-300">
          {/* Dark Glassmorphism Card */}
          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden">
            {/* Subtle Border Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 via-slate-600/10 to-gray-500/10 rounded-3xl blur-xl -z-10"></div>
            
            {/* Header */}
            <div className="relative px-8 pt-8 pb-6 border-b border-gray-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-gray-700 to-slate-700 rounded-xl">
                    <GraduationCap className="w-6 h-6 text-gray-200" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-100">
                    Create New Division
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-700/50 rounded-xl transition-all duration-300 text-gray-400 hover:text-gray-200 group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>

            <div className="px-8 pb-8 space-y-6">
              {/* Division Name */}
              <div className="group">
                <label className="flex items-center gap-2 text-gray-300 mb-3 font-medium">
                  <BookOpen className="w-4 h-4" />
                  Division Name
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.divisionName}
                    onChange={(e) => setFormData(prev => ({ ...prev, divisionName: e.target.value }))}
                    placeholder="e.g., 1-A, 2-B"
                    className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 hover:border-gray-500/70 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Class Teacher */}
              <div className="group">
                <label className="flex items-center gap-2 text-gray-300 mb-3 font-medium">
                  <User className="w-4 h-4" />
                  Class Teacher
                  <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.classTeacherId}
                    onChange={(e) => setFormData(prev => ({ ...prev, classTeacherId: e.target.value }))}
                    className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 hover:border-gray-500/70 transition-all duration-300 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-gray-800 text-gray-200">-- Select Teacher --</option>
                    {availableTeachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id} className="bg-gray-800 text-gray-200">
                        {`${teacher.firstName} ${teacher.lastName}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Subjects */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-3 font-medium">
                  <BookOpen className="w-4 h-4" />
                  Subjects (Optional)
                </label>
                
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 relative group">
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full bg-gray-800/70 backdrop-blur-sm border border-gray-600/50 rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500/50 hover:border-gray-500/70 transition-all duration-300 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-gray-800 text-gray-200">-- Select Subject --</option>
                      {availableSubjects
                        .filter(subject => !formData.subjects.includes(subject))
                        .map((subject) => (
                          <option key={subject} value={subject} className="bg-gray-800 text-gray-200">
                            {subject}
                          </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  <button
                    type="button"
                    onClick={addSubject}
                    disabled={!selectedSubject}
                    className="px-4 py-3 bg-gradient-to-r from-gray-700 to-slate-700 hover:from-gray-600 hover:to-slate-600 disabled:from-gray-800 disabled:to-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-gray-200 font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Subject Tags */}
                {formData.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.map((subject, index) => (
                      <span
                        key={subject}
                        className="group bg-gray-800/60 backdrop-blur-sm border border-gray-600/40 text-gray-200 px-3 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-700/60 hover:border-gray-500/50 transition-all duration-300 animate-in slide-in-from-left"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {subject}
                        <button
                          type="button"
                          onClick={() => removeSubject(subject)}
                          className="text-gray-400 hover:text-gray-200 hover:bg-red-500/20 rounded-full p-1 transition-all duration-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-800/70 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-600/50 hover:border-gray-500/70 text-gray-200 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-gray-700 to-slate-700 hover:from-gray-600 hover:to-slate-600 text-gray-200 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  Create Division
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};

export default CreateDivisionModal;
