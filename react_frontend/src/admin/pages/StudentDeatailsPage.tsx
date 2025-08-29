import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';;
import { fetchAllStudents, updateStudent } from '../../store/studentSlice'; 
import type { Student } from '../../types/student';
import { ArrowLeft, User,  Mail,  Phone,  MapPin,  Calendar,  BookOpen,  Shield,  Heart,  Camera, CheckCircle,XCircle,GraduationCap,UserCheck,  UserX} from 'lucide-react';
import { Button } from '../../components/ui/button';

import { useNotification } from '../../context/notification/useNotification';
// import Loading from '../../components/Loading';
import InfoCard from '../components/StudentInfoCard';
import LoadingIndicator from '../../components/shared/LoadingIndicator';
import { useAppDispatch, useAppSelector } from '../../hooks/app.hooks';

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const { showNotification } = useNotification();

  const { student: storeStudent, students, loading, error } = useAppSelector((state) => state.student);
  const [student, setStudent] = useState<Student | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllStudents());
  }, [dispatch]);

  useEffect(() => {
    const found = students.find((s) => s._id === id);
    if (found) {
      setStudent(found);
      setPreviewImage(found.profilePicture || null);
    }
  }, [students, id]);

  useEffect(() => {
    if (storeStudent && storeStudent._id === id) {
      setStudent(storeStudent); 
    }
  }, [storeStudent, id]);

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

  const handleToggleStatus = async () => {
    if (!student) return;
    
    try {
      await dispatch(updateStudent({ 
        id: student._id as string, 
        updates: { isActive: !student.isActive } 
      })).unwrap();
      
      showNotification('success', {
        title: 'Status Updated',
        message: `Student ${student.isActive ? 'suspended' : 'activated'} successfully`
      });
      
      // Refresh the students list to get updated data
      await dispatch(fetchAllStudents());
      
    } catch  {
      showNotification('error', {
        title: 'Update Failed',
        message: 'Failed to update student status'
      });
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !student) return;

    setImageUploading(true);
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setPreviewImage(base64);
        
        try {
          await dispatch(updateStudent({ 
            id: student._id as string, 
            updates: { profilePicture: base64 } 
          })).unwrap();
          
          showNotification('success', {
            title: 'Profile Updated',
            message: 'Profile picture updated successfully'
          });
          
          await dispatch(fetchAllStudents());
          
        } catch  {
          showNotification('error', {
            title: 'Update Failed',
            message: 'Failed to update profile picture'
          });
          setPreviewImage(student.profilePicture || null);
        } finally {
          setImageUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setImageUploading(false);
      showNotification('error', {
        title: 'Upload Failed',
        message: 'Failed to process image file'
      });
    }
  };

  // if (loading) {
  //   return (
  //     <Loading/>
  //   );
  // }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 mb-4 font-medium">Error: {error}</p>
          <Button onClick={handleBack} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600 mb-4 font-medium">Student not found</p>
          <Button onClick={handleBack} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen  p-6">

      <div className="mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Students
        </Button>
      </div>

      {/* Student Profile Header */}
      <div className="backdrop-blur-sm bg-white/30 rounded-3xl p-8 border border-white/20 shadow-xl mb-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Profile Image Section */}
          <div className="relative group">
            <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Profile"
                  className="h-32 w-32 object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <span className="text-blue-600 font-bold text-4xl">
                  {student.firstName?.charAt(0)}
                </span>
              )}
              {/* Image Upload Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={imageUploading}
              className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
              title="Change Profile Picture"
            />
            {imageUploading && (
              <div className="absolute inset-0 bg-white/80 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
              </div>
            )}
          </div>

          {/* Student Info */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-800 to-indigo-600 bg-clip-text text-transparent mb-2">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 text-lg mb-4">{student.email}</p>
            
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start mb-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${
                student.isActive 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {student.isActive ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    
                    Active Student
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Suspended
                  </>
                )}
              </div>
              
              {student.rollNumber && (
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">
                  Roll: {student.rollNumber}
                </div>
              )}
              
              {student.classLevel && (
                <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold text-sm">
                  Class: {student.classLevel}
                </div>
              )}
            </div>

            <Button
              onClick={handleToggleStatus}
              className={`${
                student.isActive 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
            >
              {student.isActive ?(
                loading? (<LoadingIndicator text='Suspending...'/>):(<><UserX className="w-4 h-4 mr-2" />Suspend Student</>)
              ):loading ? (<LoadingIndicator text='Activating...'/>):(<>  <UserCheck className="w-4 h-4 mr-2" />Activate</>) }
            </Button>
          </div>
        </div>
      </div>

      {/* Student Details Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <InfoCard
            title="Personal Information"
            icon={<User className="w-5 h-5 text-blue-600" />}
            data={[
              { 
                label: 'Date of Birth', 
                value: formatDate(student.dob),
                icon: <Calendar className="w-4 h-4 text-blue-500" />
              },
              { 
                label: 'Gender', 
                value: student.gender,
                icon: <User className="w-4 h-4 text-purple-500" />
              },
              { 
                label: 'Blood Group', 
                value: student.bloodGroup,
                icon: <Heart className="w-4 h-4 text-red-500" />
              },
              { 
                label: 'Nationality', 
                value: student.nationality,
                icon: <Shield className="w-4 h-4 text-green-500" />
              },
              { 
                label: 'Religion', 
                value: student.religion,
                icon: <BookOpen className="w-4 h-4 text-orange-500" />
              },
              { 
                label: 'Caste', 
                value: student.cast,
                icon: <User className="w-4 h-4 text-indigo-500" />
              },
            ]}
          />

          {/* Academic Information */}
          <InfoCard
            title="Academic Information"
            icon={<GraduationCap className="w-5 h-5 text-blue-600" />}
            data={[
              { 
                label: 'Roll Number', 
                value: student.rollNumber,
                icon: <BookOpen className="w-4 h-4 text-blue-500" />
              },
              { 
                label: 'Class Level', 
                value: student.classLevel,
                icon: <GraduationCap className="w-4 h-4 text-purple-500" />
              },
              { 
                label: 'Previous School', 
                value: student.previousSchool,
                icon: <BookOpen className="w-4 h-4 text-green-500" />
              },
              { 
                label: 'Enrollment Date', 
                value: formatDate(student.enrollmentDate),
                icon: <Calendar className="w-4 h-4 text-orange-500" />
              },
            ]}
          />

          {/* Contact Information */}
          <InfoCard
            title="Contact Information"
            icon={<Phone className="w-5 h-5 text-blue-600" />}
            data={[
              { 
                label: 'Mobile Number', 
                value: student.mobileNumber,
                icon: <Phone className="w-4 h-4 text-blue-500" />
              },
              { 
                label: 'Email Address', 
                value: student.email,
                icon: <Mail className="w-4 h-4 text-purple-500" />
              },
              { 
                label: 'Address', 
                value: student.address,
                icon: <MapPin className="w-4 h-4 text-red-500" />
              },
              { 
                label: 'State', 
                value: student.state,
                icon: <MapPin className="w-4 h-4 text-green-500" />
              },
              { 
                label: 'Pincode', 
                value: student.pincode,
                icon: <MapPin className="w-4 h-4 text-orange-500" />
              },
            ]}
          />

          {/* Medical Information */}
          <InfoCard
            title="Medical Information"
            icon={<Heart className="w-5 h-5 text-blue-600" />}
            data={[
              { 
                label: 'Medical Conditions', 
                value: student.medicalInformation,
                icon: <Heart className="w-4 h-4 text-red-500" />
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDetailPage;