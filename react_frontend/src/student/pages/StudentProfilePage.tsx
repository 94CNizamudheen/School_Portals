import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { FileUser, Hospital } from 'lucide-react';
import { useState } from 'react';
import ChangePasswordModal from '../components/StudentPasswordChange';

 
const StudentProfilePage = () => {
    const student = useSelector((state: RootState) => state.student.student);

    const [showModal, setShowModal] = useState(false);


    if (!student) return null;

    return (
        <div className="min-h-screen  p-6 text-white font-sans mt-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="flex flex-col space-y-6">
        
                    <div className="student-card-bg rounded-xl p-8 flex flex-col items-center space-y-4 shadow-lg ">
                        <img
                            src={student.profilePicture || '/default-avatar.png'}
                            alt="Profile"
                            className="w-40 bg-fuchsia-300 h-40 rounded-full border-4 border-white"
                        />
                        <div className="text-center mt-8">
                            <h2 className="text-xl font-bold">{student.firstName} {student.lastName}</h2>
                            <p className="mt-2">Age: {new Date().getFullYear() - new Date(student.dob as string).getFullYear()}</p>
                            <p>Class: {student.classLevel}</p>
                            <p>Division: {student.division || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Actions Card */}
                    <div className="student-card-bg rounded-xl p-4 shadow-lg">
                        <div className="space-y-3">
                
                            <button onClick={()=>setShowModal(true)}  className="w-full bg-white text-blue-600 py-2 rounded-full font-medium">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>


                {/* Right Section: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Info */}
                    <div className="bg-[#2c1c5b] rounded-xl p-4 shadow-lg">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-2"> <FileUser size={30}/> General Information</h3>
                        <div className="bg-white text-black rounded-lg p-4 space-y-2">
                            <p><strong>Identity:</strong> {student.identity}</p>
                            <p><strong>DOB:</strong> {new Date(student.dob as string).toLocaleDateString()}</p>
                            <p><strong>Gender:</strong> {student.gender}</p>
                            <p><strong>Blood Group:</strong> {student.bloodGroup}</p>
                            <p><strong>Parent Mobile:</strong> {student.mobileNumber}</p>
                            <p><strong>Parent Email:</strong> {student.email}</p>
                            <p><strong>Nationality:</strong> {student.nationality}</p>
                            <p><strong>Religion:</strong> {student.religion}</p>
                            <p><strong>Cast:</strong> {student.cast}</p>
                            <p><strong>Address:</strong> {student.address}, {student.state} - {student.pincode}</p>
                        </div>
                    </div>
       
                    {/* Other Info */}
                    <div className="bg-[#2c1c5b] rounded-xl p-4 shadow-lg">
                        <h3 className="text-lg font-bold flex items-center gap-2 mb-2"><Hospital size={30} className='text-red-500'/> Medical Information</h3>
                        <p className="text-sm text-white/90">
                            {student.medicalInformation || 'No medical information provided.'}
                        </p>
                    </div>
                </div>
            </div>
            {showModal &&(<ChangePasswordModal onClose={()=>setShowModal(false)}/>)}
        </div>
    );
};

export default StudentProfilePage;
