import React, { useState } from "react";
import * as Yup from "yup";
import { divisionSchema } from "../../../utils/validationSchemas";
import type { Teacher } from "../../../types/teacher.types";
import type { CreateDivisionForm } from "../pages/ClassAndDivisionPage";
import { BookOpen, GraduationCap, Plus, User, X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: CreateDivisionForm) => void;
  availableTeachers: Teacher[];
}

const CreateDivisionModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableTeachers,
}) => {
  const [formData, setFormData] = useState<CreateDivisionForm>({
    classLevel: "",
    divisionName: "",
    subjects: [],
    classTeacherId: "",
  });
  const [selectedSubject, setSelectedSubject] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = async (fieldName: keyof CreateDivisionForm, value: unknown) => {
    try {
      const fieldSchema = Yup.reach(divisionSchema, fieldName) as Yup.Schema<unknown>;
      await fieldSchema.validate(value);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [fieldName]: err.message }));
      }
    }
  };

  const handleSubmit = async () => {
    try {
      setErrors({});
      await divisionSchema.validate(formData, { abortEarly: false });

      onSubmit(formData);
      setFormData({
        divisionName: "",
        subjects: [],
        classTeacherId: "",
        classLevel: "",
      });
      setSelectedSubject("");
      onClose();
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((e) => {
          if (e.path && !newErrors[e.path]) {
            newErrors[e.path] = e.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  const addSubject = () => {
    if (
      selectedSubject.trim() &&
      !formData.subjects.includes(selectedSubject.trim())
    ) {
      const updatedSubjects = [...formData.subjects, selectedSubject.trim()];
      setFormData((prev) => ({ ...prev, subjects: updatedSubjects }));
      setSelectedSubject("");
      validateField("subjects", updatedSubjects);
    }
  };

  const removeSubject = (subject: string) => {
    const updatedSubjects = formData.subjects.filter((s) => s !== subject);
    setFormData((prev) => ({ ...prev, subjects: updatedSubjects }));
    validateField("subjects", updatedSubjects);
  };

  const availableSubjects = [
    "Mathematics",
    "Malayalam",
    "Arabic",
    "English ",
    "Physics",
    "Chemistry",
    "Biology",
    "History",
    "Geography",
    "Computer Science",
    "Art & Design",
    "Physical Education",
  ];
  const availableClassLevels = [
    "LKG",
    "UKG",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-full p-4 bg backdrop-blur-sm">
        <div className="relative max-w-md transform">
          <div className="relative bg-gray-900/80 border border-gray-700/50 rounded-3xl shadow-2xl">
            {/* Header */}
            <div className="relative px-8 pt-8 pb-6 border-b border-gray-700/30 flex justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap className="w-6 h-6 text-gray-200" />
                <h2 className="text-2xl font-bold text-gray-100">
                  Create New Division
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-8 pb-8 space-y-6">
              {/* Class Level */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-3 font-medium">
                  <BookOpen className="w-4 h-4" /> Class Level{" "}
                  <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.classLevel}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({ ...prev, classLevel: value }));
                    validateField("classLevel", value);
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-gray-200"
                >
                  <option value="">-- Select Class Level --</option>
                  {availableClassLevels.map((classLevel, index) => (
                    <option key={index} value={classLevel}>
                      {classLevel}
                    </option>
                  ))}
                </select>
                {errors.classLevel && (
                  <p className="text-red-400 text-sm">{errors.classLevel}</p>
                )}
              </div>

              {/* Division Name */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-3 font-medium">
                  <BookOpen className="w-4 h-4" /> Division Name{" "}
                  <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.divisionName}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase();
                    setFormData((prev) => ({ ...prev, divisionName: value }));
                    validateField("divisionName", value);
                  }}
                  placeholder="e.g., 1-A, 2-B"
                  className="uppercase w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-gray-200"
                />
                {errors.divisionName && (
                  <p className="text-red-400 text-sm">{errors.divisionName}</p>
                )}
              </div>

              {/* Class Teacher */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-3 font-medium">
                  <User className="w-4 h-4" /> Class Teacher{" "}
                  <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.classTeacherId}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => ({ ...prev, classTeacherId: value }));
                    validateField("classTeacherId", value);
                  }}
                  className="w-full bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-gray-200"
                >
                  <option value="">-- Select Teacher --</option>
                  {availableTeachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {`${teacher.firstName} ${teacher.lastName}`}
                    </option>
                  ))}
                </select>
                {errors.classTeacherId && (
                  <p className="text-red-400 text-sm">
                    {errors.classTeacherId}
                  </p>
                )}
              </div>

              {/* Subjects */}
              <div>
                <label className="flex items-center gap-2 text-gray-300 mb-3 font-medium">
                  <BookOpen className="w-4 h-4" /> Subjects
                </label>
                <div className="flex gap-2 mb-4">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-xl px-4 py-3 text-gray-200"
                  >
                    <option value="">-- Select Subject --</option>
                    {availableSubjects
                      .filter((s) => !formData.subjects.includes(s))
                      .map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                  </select>
                  <button
                    type="button"
                    onClick={addSubject}
                    disabled={!selectedSubject}
                    className="px-4 py-3 bg-gray-700 text-gray-200 rounded-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {formData.subjects.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.subjects.map((subject) => (
                      <span
                        key={subject}
                        className="bg-gray-800 text-gray-200 px-3 py-2 rounded-lg flex items-center gap-2"
                      >
                        {subject}
                        <button
                          onClick={() => removeSubject(subject)}
                          className="text-red-400"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.subjects && (
                  <p className="text-red-400 text-sm">{errors.subjects}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-800 text-gray-200 py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-gray-700 text-gray-200 py-3 rounded-xl"
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
