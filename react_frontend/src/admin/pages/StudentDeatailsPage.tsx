import React, { useEffect, useState,  } from 'react';
import type { ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllStudents, updateStudent } from '../../store/studentSlice';
import { InfoCard } from '../components/Infocard';
import { EditModal } from '../components/EditInfoModal';
import type { RootState, AppDispatch } from '../../store/store';
import type { Student } from '../../types/student';

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const {student:storeStudent, students, loading, error } = useSelector((state: RootState) => state.student);
  const [student, setStudent] = useState<Student | null>(null);
  const [editingSection, setEditingSection] = useState<'personal' | 'academic' | 'contact' | 'medical' | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
  if (storeStudent) {
    setStudent(storeStudent); 
  }
}, [storeStudent]);
  useEffect(() => {
    dispatch(fetchAllStudents());
  }, [dispatch]);

  useEffect(() => {
    const found = students.find((s) => s._id === id);
    setStudent(found || null);
    setPreviewImage(found?.profileImage || null);
  }, [students, id]);

  const handleBack = () => {
    navigate('/admin/students');
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return 'Not specified';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSave = (updates: Partial<Student>) => {
    if (student) {
      dispatch(updateStudent({ id: student._id, updates }));
    }
  };

  const handleToggleStatus = () => {
    if (student) {
      dispatch(updateStudent({ id: student._id, updates: { isActive: !student.isActive } }));
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && student) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPreviewImage(base64);
        dispatch(updateStudent({ id: student._id, updates: { profileImage: base64 } }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600">
        Loading student details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <button onClick={handleBack} className="bg-blue-600 text-white px-4 py-2 rounded-md">
          Back
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen flex justify-center items-center flex-col">
        <p className="text-gray-600">Student not found.</p>
        <button onClick={handleBack} className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4">
          Back to Students
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-800 text-white">
      {/* Student Profile */}
      <div className="bg-gray-800 text-gray-100 shadow rounded-lg mb-6">
        <div className="px-6 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile"
                    className="h-24 w-24 object-cover rounded-full"
                  />
                ) : (
                  <span className="text-blue-600 font-bold text-2xl">
                    {student.firstName?.charAt(0)}
                  </span>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
                title="Change Profile Picture"
              />
            </div>
            <div className="ml-6">
              <h2 className="text-3xl font-bold">
                {student.firstName} {student.lastName}
              </h2>
              <p className="text-gray-400 text-lg">{student.email}</p>
              <div className="mt-2">
                <span
                  className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {student.isActive ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleToggleStatus}
            className={`text-white px-4 py-2 rounded-md ${
              student.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {student.isActive ? 'Suspend Student' : 'Activate Student'}
          </button>
        </div>
      </div>

      {/* Student Detail Sections */}
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Student Details</h1>
          <button onClick={handleBack} className="text-sm text-blue-400 underline">
            Back to List
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            title="Personal Information"
            data={[
              { label: 'Date of Birth', value: formatDate(student.dateOfBirth) },
              { label: 'Gender', value: student.gender },
              { label: 'Blood Group', value: student.bloodGroup },
              { label: 'Nationality', value: student.nationality },
            ]}
            onEdit={() => setEditingSection('personal')}
          />

          <InfoCard
            title="Academic Information"
            data={[
              { label: 'Roll Number', value: student.rollNumber },
              { label: 'Grade', value: student.grade },
              { label: 'Class', value: student.class },
              { label: 'Previous School', value: student.previousSchool },
              { label: 'Enrollment Date', value: formatDate(student.enrollmentDate) },
            ]}
            onEdit={() => setEditingSection('academic')}
          />

          <InfoCard
            title="Contact Information"
            data={[
              { label: 'Mobile Number', value: student.mobileNumber },
              { label: 'Email Address', value: student.email },
              { label: 'Address', value: student.address },
              { label: 'City', value: student.city },
              { label: 'State', value: student.state },
              { label: 'Pincode', value: student.pincode },
            ]}
            onEdit={() => setEditingSection('contact')}
          />

          <InfoCard
            title="Medical Information"
            data={[
              { label: 'Medical Conditions', value: student.medicalConditions },
              { label: 'Allergies', value: student.allergies },
              { label: 'Medications', value: student.medications },
            ]}
            onEdit={() => setEditingSection('medical')}
          />
        </div>

        {editingSection && (
          <EditModal
            section={editingSection}
            student={student}
            onClose={() => setEditingSection(null)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default StudentDetailPage;
