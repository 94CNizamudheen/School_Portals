
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Student } from '../../types/student';

interface StudentDetailPageProps {
  // Optional prop if you want to pass student data directly
  student?: Student;
}

const StudentDetailPage: React.FC<StudentDetailPageProps> = ({ student: propStudent }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(propStudent || null);
  const [loading, setLoading] = useState(!propStudent);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!propStudent && id) {
      fetchStudent();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, propStudent]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/students/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch student details');
      }

      const studentData = await response.json();
      setStudent(studentData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    if (!student) return;

    try {
      setIsUpdating(true);
      const response = await fetch(`/api/students/${student._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !student.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update student status');
      }

      const updatedStudent = await response.json();
      setStudent(updatedStudent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    navigate(`/students/${student?._id}/edit`);
  };

  const handleBack = () => {
    navigate('/students');
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Student not found</p>
          <button
            onClick={handleBack}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={handleBack}
                  className="mr-4 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Student Details</h1>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleStatusToggle}
                  disabled={isUpdating}
                  className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                    student.isActive
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUpdating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </div>
                  ) : (
                    student.isActive ? 'Suspend Student' : 'Activate Student'
                  )}
                </button>
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Edit Student
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Student Profile */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-6">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
                {student.profileImage ? (
                  <img
                    src={student.profileImage}
                    alt={`${student.firstName} ${student.lastName}`}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 font-bold text-2xl">
                    {student.firstName?.charAt(0)}
                  </span>
                )}
              </div>
              <div className="ml-6">
                <h2 className="text-3xl font-bold text-gray-900">
                  {student.firstName} {student.lastName}
                </h2>
                <p className="text-gray-600 text-lg">{student.email}</p>
                <div className="mt-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {student.isActive ? 'Active' : 'Suspended'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Academic Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Academic Information</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                  <p className="mt-1 text-sm text-gray-900">{student.rollNumber || 'Not assigned'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Grade</label>
                  <p className="mt-1 text-sm text-gray-900">{student.grade || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Class</label>
                  <p className="mt-1 text-sm text-gray-900">{student.class || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Previous School</label>
                  <p className="mt-1 text-sm text-gray-900">{student.previousSchool || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Enrollment Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.enrollmentDate ? formatDate(student.enrollmentDate) : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.dateOfBirth ? formatDate(student.dateOfBirth) : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender</label>
                  <p className="mt-1 text-sm text-gray-900">{student.gender || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                  <p className="mt-1 text-sm text-gray-900">{student.bloodGroup || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nationality</label>
                  <p className="mt-1 text-sm text-gray-900">{student.nationality || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Religion</label>
                  <p className="mt-1 text-sm text-gray-900">{student.religion || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                  <p className="mt-1 text-sm text-gray-900">{student.mobileNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <p className="mt-1 text-sm text-gray-900">{student.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{student.address || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <p className="mt-1 text-sm text-gray-900">{student.city || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <p className="mt-1 text-sm text-gray-900">{student.state || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pincode</label>
                  <p className="mt-1 text-sm text-gray-900">{student.pincode || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
            </div>
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.medicalConditions || 'None specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Allergies</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.allergies || 'None specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Medications</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {student.medications || 'None specified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;