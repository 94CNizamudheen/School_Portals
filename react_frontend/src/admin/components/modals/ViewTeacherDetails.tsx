import { FileText, CheckCircle, XCircle, Download, ExternalLink, Badge, X } from "lucide-react";
import type { Teacher } from "../../../types/teacher.types";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import ConfirmModal from "./ConfirmDeleteModal";
import { useState, useEffect } from "react";

interface TeacherDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    teacher: Teacher | null;
    onVerify: (teacherId: string) => void;
    onReject: (teacherId: string) => void;
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'verified': return 'text-green-600 bg-green-50';
        case 'pending': return 'text-yellow-600 bg-yellow-50';
        case 'rejected': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
    }
};

const TeacherDetailsModal: React.FC<TeacherDetailsModalProps> = ({
    isOpen,
    onClose,
    teacher,
    onVerify,
    onReject
}) => {
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [isOpen]);

    const handleDownloadDocument = (docUrl: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = docUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getFileNameFromUrl = (url: string, index: number) => {
        try {
            const urlParts = url.split('/');
            const fileName = urlParts[urlParts.length - 1];
            return fileName.includes('.') ? fileName : `Document_${index + 1}.pdf`;
        } catch {
            return `Document_${index + 1}.pdf`;
        }
    };

    const isImageFile = (url: string) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
        return imageExtensions.some(ext => url.toLowerCase().includes(ext));
    };

    const isPdfFile = (url: string) => {
        return url.toLowerCase().includes('.pdf');
    };

    const handleVerifyAndClose = () => {
        if (teacher) {
            onVerify(teacher._id);
            onClose();
        }
    };

    const handleRejectAndClose = () => {
        if (teacher) {
            setConfirmOpen(true);
        }
    };

    const handleConfirmReject = () => {
        if (teacher) {
            onReject(teacher._id);
            setConfirmOpen(false);
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !teacher) return null;

    return (
        <>
            <div className="fixed inset-0 z-50">
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden' }}
                    onClick={handleBackdropClick}
                >
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <div
                            className="bg-gray-800 rounded-lg shadow-xl border max-w-4xl max-h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex-shrink-0 relative border-b border-gray-700">
                                <div className="flex items-center gap-2 p-6 pb-4">
                                    <FileText className="h-5 w-5 text-white" />
                                    <h2 className="text-lg font-semibold text-white">
                                        {`${teacher.firstName} ${teacher.lastName} - Documents`}
                                    </h2>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    aria-label="Close modal"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div
                                className="flex-1 overflow-y-auto overflow-x-hidden px-6"
                                style={{
                                    maxHeight: 'calc(90vh - 120px)',
                                    overscrollBehavior: 'contain'
                                }}
                            >
                                <div className="space-y-6 py-6">
                                    <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-4 rounded-lg">
                                        <div className="flex items-center gap-4 mb-4">
                                            <Avatar className="h-16 w-16">
                                                <AvatarImage src={teacher.profileImage} />
                                                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-400 text-white font-semibold">
                                                    {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h3 className="text-xl font-semibold text-white">{teacher.firstName} {teacher.lastName}</h3>
                                                <p className="text-gray-300">{teacher.subject} Teacher</p>
                                                <Badge className={`mt-1 ${getStatusColor(teacher.status)}`}>
                                                    {teacher.status}
                                                </Badge>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="space-y-2 text-gray-200">
                                                <p><strong>Email:</strong> {teacher.email}</p>
                                                <p><strong>Phone:</strong> {teacher.mobileNumber}</p>
                                                <p><strong>DOB:</strong> {new Date(teacher.dob).toLocaleDateString()}</p>
                                            </div>
                                            <div className="space-y-2 text-gray-200">
                                                <p><strong>Qualification:</strong> {teacher.qualification}</p>
                                                <p><strong>University:</strong> {teacher.university}</p>
                                                <p><strong>Experience:</strong> {teacher.experience} years</p>
                                                <p><strong>Certificate No:</strong> {teacher.KTET_CTET_certificateNo}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                                            <FileText className="h-5 w-5" />
                                            Eligibility Documents ({teacher.eligibilityDocuments.length})
                                        </h4>

                                        {teacher.eligibilityDocuments.length === 0 ? (
                                            <p className="text-gray-400 text-center py-8">No documents uploaded</p>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {teacher.eligibilityDocuments.map((doc, idx) => {
                                                    const fileName = getFileNameFromUrl(doc, idx);
                                                    const isImage = isImageFile(doc);
                                                    const isPdf = isPdfFile(doc);

                                                    return (
                                                        <Card key={idx} className="p-4 hover:shadow-md transition-shadow bg-gray-700 border-gray-600">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center justify-between">
                                                                    <h5 className="font-medium text-sm truncate text-white">{fileName}</h5>
                                                                    <Badge className="bg-gray-600 text-gray-200">
                                                                        {isImage ? 'Image' : isPdf ? 'PDF' : 'Document'}
                                                                    </Badge>
                                                                </div>

                                                                {/* Document Preview */}
                                                                <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-600">
                                                                    {isImage ? (
                                                                        <img
                                                                            src={doc}
                                                                            alt={fileName}
                                                                            className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                                            onClick={() => window.open(doc, '_blank')}
                                                                        />
                                                                    ) : isPdf ? (
                                                                        <div className="h-32 flex items-center justify-center text-gray-300">
                                                                            <div className="text-center">
                                                                                <FileText className="h-8 w-8 mx-auto mb-2" />
                                                                                <p className="text-xs">PDF Document</p>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="h-32 flex items-center justify-center text-gray-300">
                                                                            <div className="text-center">
                                                                                <FileText className="h-8 w-8 mx-auto mb-2" />
                                                                                <p className="text-xs">Document</p>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex-1 text-xs bg-transparent border-gray-500 text-gray-200 hover:bg-gray-600"
                                                                        onClick={() => window.open(doc, '_blank')}
                                                                    >
                                                                        <ExternalLink className="h-3 w-3 mr-1" />
                                                                        View
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="flex-1 text-xs bg-transparent border-gray-500 text-gray-200 hover:bg-gray-600"
                                                                        onClick={() => handleDownloadDocument(doc, fileName)}
                                                                    >
                                                                        <Download className="h-3 w-3 mr-1" />
                                                                        Download
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    {teacher.status === 'pending' && (
                                        <div className="border-t border-gray-600 pt-4 sticky bottom-0 bg-gray-800">
                                            <div className="flex gap-4 justify-end">
                                                <Button
                                                    variant="destructive"
                                                    className="hover:bg-red-600"
                                                    onClick={handleRejectAndClose}
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Reject Application
                                                </Button>
                                                <Button
                                                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                                    onClick={handleVerifyAndClose}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Verify & Approve
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmReject}
                title="Reject Application?"
                description="Are you sure you want to reject this teacher's application? This action cannot be undone."
            />
        </>
    );
};

export default TeacherDetailsModal;