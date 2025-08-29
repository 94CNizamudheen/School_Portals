


import { useEffect, useState } from 'react';
import { ChevronDown, Edit, FileUser, Hospital } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from "../../types/store.types"; 
import { fetchChildrenOfParent, updateParent } from '../../store/parentSlice';
import EditMedicalInfoModal from '../modals/EditMedicalnfoModal';
import ParentEditModal from '../modals/EditParentModal';
import { useNotification } from '../../context/notification/useNotification';
import type { AxiosError } from 'axios';
import ChangePasswordModal from '../../components/ChangePasswordModal';

const StudentParentProfile = () => {
  const parent = useSelector((state: RootState) => state.parent.parent);
  const studentsData = useSelector((state: RootState) => state.parent.childrens);
  const [isOpenMedicalinfoModal, setOpenMedicalinfoModal] = useState(false)
  const [isOpenParentEditModal, setOpenParentEditModal] = useState(false)
  const [isChangePasswordModalOpen,setChangePasswordModalOpen]= useState(false)
  const { showNotification } = useNotification()

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (parent?._id) {
      dispatch(fetchChildrenOfParent(parent._id));
    }
  }, [dispatch, parent]);

  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (studentsData.length > 0 && !selectedStudentId) {
      setSelectedStudentId(studentsData[0]?._id ?? null);
    }
  }, [studentsData, selectedStudentId]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const selectedStudent = studentsData.find((student) => student._id === selectedStudentId);
  const selectedRelation = parent?.relations?.find((rel) => rel.admissionId === selectedStudent?.admissionId);

  const formatDate = (dateString: string) => {
    return dateString
      ? new Date(dateString).toLocaleDateString("en-GB")
      : "";
  };

  const handleSave = async (updates: { email?: string; mobileNumber?: string }) => {
    try {
      await dispatch(updateParent({ id: parent?._id as string, updates })).unwrap()
      showNotification('success', { message: "Parent data updated" })
      setOpenParentEditModal(false)
    } catch (error) {
      const err = error as AxiosError<{ message: string }>
      showNotification('error', { message: err.response?.data.message })
    }
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-6xl mx-auto">
        {/* Student Selection Dropdown */}
        <div className="mb-6">
          <div className="relative inline-block w-80">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 text-white flex items-center justify-between hover:bg-white/15 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={selectedStudent?.profilePicture}
                  alt={selectedStudent?.firstName}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white/30"
                />
                <span className="font-medium">
                  {selectedStudent?.firstName} {selectedStudent?.lastName} - {selectedStudent?.classLevel}
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl z-10">
                {studentsData.map((student) => (
                  <button
                    key={student._id}
                    onClick={() => {
                      setSelectedStudentId(student._id ?? null);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-indigo-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${selectedStudentId === student._id ? 'bg-indigo-100' : ''
                      }`}
                  >
                    <img
                      src={student.profilePicture}
                      alt={student.firstName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-800">
                        {student.firstName} {student.lastName}
                      </div>
                      <div className="text-sm text-gray-600">
                        {student.classLevel} - {student.identity}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Left Column - Student & Parent Info */}
          <div className="w-80 space-y-6">
            {/* Student Profile Card */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="text-center">
                <div className="relative">
                  <img
                    src={selectedStudent?.profilePicture}
                    alt={selectedStudent?.firstName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white/20 mx-auto mb-4"
                  />
                </div>
                <h2 className="text-white text-xl font-semibold mb-2">
                  {selectedStudent?.firstName} {selectedStudent?.lastName}
                </h2>

                <div className="space-y-2 text-white/70 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">CLASS:</span>
                    <span>{selectedStudent?.classLevel ? selectedStudent.classLevel.split(' ')[1] : ''}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">DIVISION:</span>
                    <span>{selectedStudent?.division}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Parent Information Card */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
              <h3 className="text-white text-lg font-semibold mb-4">{parent?.name}</h3>
              <div className="text-white/70 text-sm space-y-2">
                <div>
                  <div className="font-medium text-white/90">
                    Relation: {selectedRelation ? selectedRelation.relationship : "N/A"}
                  </div>
                </div>


                <div className="mt-3">
                  <div className="font-medium text-white/50 text-xs mb-1">Mobile:</div>
                  <div>{parent?.mobileNumber}</div>
                </div>
                <div className="mt-3">
                  <div className="font-medium text-white/50 text-xs mb-1">Email:</div>
                  <div className="break-all">{parent?.email}</div>
                </div>
              </div>

              <div className="flex space-x-2 mt-6">
                <button onClick={() => setOpenParentEditModal(true)} className="flex-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors">
                  Edit
                </button>
                <button onClick={()=>setChangePasswordModalOpen(true)} className="flex-1 bg-orange-500/80 hover:bg-orange-500 text-white rounded-lg px-3 py-2 text-sm font-medium transition-colors">
                  Change Password
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Student Details */}
          <div className="flex-1 space-y-6">

            {/* General Information */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
                    <FileUser />
                    <span>General Information</span>
                  </h3>
                  {/* <button className="bg-red-600/80 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center space-x-2">
                    <Edit className="w-4 h-4" />
                    <span>Edit</span>
                  </button> */}
                </div>

                <div className="bg-white/5 rounded-xl p-6 space-y-3 text-white text-sm">
                  <p><strong>Identity:</strong> {selectedStudent?.identity}</p>
                  <p><strong>DOB:</strong> {formatDate(selectedStudent?.dob as string)}</p>
                  <p><strong>Gender:</strong> {selectedStudent?.gender}</p>
                  <p><strong>Blood Group:</strong> {selectedStudent?.bloodGroup}</p>
                  <p><strong>Nationality:</strong> {selectedStudent?.nationality}</p>
                  <p><strong>Religion:</strong> {selectedStudent?.religion}</p>
                  <p><strong>Cast:</strong> {selectedStudent?.cast}</p>
                  <p><strong>Address:</strong> {selectedStudent?.address}, {selectedStudent?.state} - {selectedStudent?.pincode}</p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-white/10">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
                    <Hospital />
                    <span>Medical Information</span>
                  </h3>
                  <button className="bg-red-600/80 hover:bg-red-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex items-center space-x-2">
                    <Edit onClick={() => setOpenMedicalinfoModal(true)} className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="bg-white/5 rounded-xl p-6 text-white text-sm">
                  {selectedStudent?.medicalInformation || 'No medical information provided.'}
                </div>
              </div>
            </div>
            {isOpenMedicalinfoModal && selectedStudent && (
              <EditMedicalInfoModal
                isOpen={isOpenMedicalinfoModal}
                onClose={() => setOpenMedicalinfoModal(false)}
                studentId={selectedStudent._id as string}
                initialData={selectedStudent.medicalInformation}
              />
            )}
            {isOpenParentEditModal && (
              <ParentEditModal
                parent={parent}
                isOpen={isOpenParentEditModal}
                onClose={() => setOpenParentEditModal(false)}
                onSave={handleSave}
              />
            )}
            {isChangePasswordModalOpen&&(
              <ChangePasswordModal
              onClose={()=>setChangePasswordModalOpen(false)}
              />
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentParentProfile;