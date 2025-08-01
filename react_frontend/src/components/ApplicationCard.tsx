import { AlertCircle, BookOpen, Calendar, CheckCircle, ChevronDown, ChevronUp, Clock, Eye, FileText, MapPin, Phone, Smile, User, Users, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import type { AdmissionFormData } from "../types/admission.types";

interface ApplicationCardProps {
    application: AdmissionFormData
    isExpanded: boolean
    onToggle: () => void
    onPayment:(id:string)=>void
}

interface StatusConfig {
    icon: React.ComponentType<{ className?: string; size?: number }>
    color: string
    bgColor: string
    borderColor: string
    label: string
}

const getStatusConfig = (status: AdmissionFormData['status']): StatusConfig => {
    switch (status) {
        case 'approved':
            return {
                icon: CheckCircle,
                color: 'text-blue-600',
                bgColor: 'bg-blue-200',
                borderColor: 'border-blue-500',
                label: 'Approved'
            }
        case 'rejected':
            return {
                icon: XCircle,
                color: 'text-red-600',
                bgColor: 'bg-red-50',
                borderColor: 'border-red-200',
                label: 'Rejected'
            }
        case 'completed':
            return {
                icon: Smile,
                color: 'text-green-600',
                bgColor: 'bg-green-300',
                borderColor: 'border-yellow-200',
                label: 'completed'
            }
        default:
            return {
                icon: Clock,
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-50',
                borderColor: 'border-yellow-200',
                label: 'Pending'
            }
    }
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, isExpanded, onToggle, onPayment }) => {
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);
    const statusConfig = getStatusConfig(application.status)
    const StatusIcon = statusConfig.icon

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const formatDateTime = (dateString: string): string => {
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const handlePayment = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsPaymentLoading(true);
        
        try {
             onPayment(application._id);
        } catch (error) {
            console.error('Payment error:', error);
        } finally {
            setIsPaymentLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            {/* Application Header - Always Visible */}
            <div
                className={`${statusConfig.bgColor} ${statusConfig.borderColor} border-l-4 p-6 cursor-pointer`}
                onClick={onToggle}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">
                                {application.firstName} {application.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Class: {application.classApplied} | Status: {statusConfig.label}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Applied: {formatDateTime(application.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right text-sm text-gray-500 hidden sm:block">
                            <p>Application ID</p>
                            <p className="font-mono font-medium">#{application._id?.slice(-8) || 'N/A'}</p>
                        </div>
                        {isExpanded ? (
                            <ChevronUp className="w-6 h-6 text-gray-400" />
                        ) : (
                            <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {/* Status Notes - Always Visible if Present */}
            {(application.verificationNotes || application.rejectionReason) && (
                <div className="p-4 bg-gray-50 border-b ">
                    <div className="flex justify-between space-x-2">
                        
                        <div>
                            <AlertCircle />
                            <h4 className="font-medium text-gray-900 text-sm mb-1">
                                {application.status === 'rejected' ? 'Rejection Reason' : 'Admin Notes'}
                            </h4>
                            <p className="text-gray-700 text-sm">
                                {application.rejectionReason || application.verificationNotes}
                            </p>
                        </div>
                        {application.status === "approved" && (
                            <div className="ml-12 sm:ml-16">
                                <button
                                    className={`relative flex items-center justify-center px-4 py-2 rounded-md shadow text-white transition duration-200 min-w-[140px] ${
                                        isPaymentLoading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                    onClick={handlePayment}
                                    disabled={isPaymentLoading}
                                >
                                    {isPaymentLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Pay Admission Fee'
                                    )}
                                </button>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isPaymentLoading ? 'Please wait...' : 'Note: Complete the admission process'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Expandable Details */}
            {isExpanded && (
                <div className="p-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Student Information */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-indigo-600" />
                                    Student Information
                                </h4>
                                <div className="space-y-3 pl-7">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Full Name:</span>
                                        <span className="font-medium text-indigo-600">{application.firstName} {application.lastName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Date of Birth:</span>
                                        <span className="font-medium text-indigo-600">{formatDate(application.dob)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Blood Group:</span>
                                        <span className="font-medium text-red-600 ">{application.bloodGroup}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Nationality:</span>
                                        <span className="font-medium text-indigo-600">{application.nationality}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Class Applied:</span>
                                        <span className="font-medium text-indigo-600">{application.classApplied}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Religion:</span>
                                        <span className="font-medium text-indigo-600">{application.religion}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Cast:</span>
                                        <span className="font-medium text-indigo-600">{application.cast}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Gender:</span>
                                        <span className="font-medium text-indigo-600">{application.gender}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-indigo-600" />
                                    Address Information
                                </h4>
                                <div className="space-y-3 pl-7">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Address:</span>
                                        <span className="font-medium text-right flex-1 ml-4 text-indigo-600">{application.address}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">State:</span>
                                        <span className="font-medium text-indigo-600">{application.state}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Pincode:</span>
                                        <span className="font-medium text-indigo-600">{application.pincode}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Parent/Guardian Information */}
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                    <Users className="w-5 h-5 mr-2 text-green-600" />
                                    Parent/Guardian Information
                                </h4>
                                <div className="space-y-3 pl-7">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Name:</span>
                                        <span className="font-medium text-indigo-600">{application.parentName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 ">Relation:</span>
                                        <span className="font-medium text-indigo-600">{application.relationToStudent}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Occupation:</span>
                                        <span className="font-medium text-indigo-600">{application.parentOccupation || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                    <Phone className="w-5 h-5 mr-2 text-green-600" />
                                    Contact Information
                                </h4>
                                <div className="space-y-3 pl-7">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium text-right flex-1 ml-4 text-indigo-600">{application.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mobile:</span>
                                        <span className="font-medium text-indigo-600">{application.mobileNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Emergency Contact:</span>
                                        <span className="font-medium text-indigo-600">{application.emergencyContactName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Emergency Number:</span>
                                        <span className="font-medium text-indigo-600">{application.emergencyContactNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Previous School Information */}
                    {application.previousSchool && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                                Previous School Information
                            </h4>
                            <div className="pl-7 space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Previous School:</span>
                                    <span className="font-medium text-indigo-600">{application.previousSchool}</span>
                                </div>
                                {application.medicalInformation && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Medical Information:</span>
                                        <span className="font-medium text-red-600">{application.medicalInformation}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Documents Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-purple-600" />
                            Documents Submitted
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                            {[
                                { label: 'Profile Picture', file: application.profilePicture },
                                { label: 'Aadhar Document', file: application.aadharDocument },
                                { label: 'Birth Certificate', file: application.birthCertificate },
                                { label: 'Transfer Certificate', file: application.transferCertificate }
                            ].filter(doc => doc.file).map((doc, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm font-medium text-gray-700">{doc.label}</span>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-800 transition-colors p-1 hover:bg-indigo-50 rounded"
                                            title="View Document"
                                            onClick={(e: React.MouseEvent) => {
                                                e.stopPropagation();
                                                if (typeof doc.file === 'string') {
                                                    window.open(doc.file, '_blank');
                                                } else if (doc.file instanceof File) {
                                                    window.open(URL.createObjectURL(doc.file), '_blank');
                                                }
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                            Application Timeline
                        </h4>
                        <div className="pl-7">
                            <div className="space-y-2 text-sm">
                                <span className="text-gray-600">Submitted:</span>
                                <span className="font-medium">{formatDateTime(application.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default ApplicationCard;