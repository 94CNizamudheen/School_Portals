import { FileText, CheckCircle, XCircle, Download, ExternalLink, Badge, X } from "lucide-react";

import type { Teacher } from "../../../types/teacher.types";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { DialogHeader } from "../../../components/ui/dialog";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import ConfirmModal from "./ConfirmDeleteModal";
import { useState } from "react";

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

    if (!teacher) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* Backdrop with blur effect */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={onClose}
                />
            )}

            <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-4xl max-h-[90vh] bg-gray-800 rounded-lg shadow-xl z-50 border">
                <DialogHeader className="relative">
                    <DialogTitle className="flex items-center gap-2 p-6 pb-0">
                        <FileText className="h-5 w-5" />
                        {`${teacher.firstName} ${teacher.lastName} - Documents`}
                    </DialogTitle>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-50 p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] px-6">
                    <div className="space-y-6 pb-6">
                        {/* Teacher Info Summary */}
                        <div className="bg-gradient-to-r from-gray-850 to-gray-500 p-4 rounded-lg">
                            <div className="flex items-center gap-4 mb-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={teacher.profileImage} />
                                    <AvatarFallback className="bg-gradient-to-br from-purple-400 to-indigo-400 text-white font-semibold">
                                        {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-semibold">{teacher.firstName} {teacher.lastName}</h3>
                                    <p className="text-gray-600">{teacher.subject} Teacher</p>
                                    <Badge className={`mt-1 ${getStatusColor(teacher.status)}`}>
                                        {teacher.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <p><strong>Email:</strong> {teacher.email}</p>
                                    <p><strong>Phone:</strong> {teacher.mobileNumber}</p>
                                    <p><strong>DOB:</strong> {new Date(teacher.dob).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-2">
                                    <p><strong>Qualification:</strong> {teacher.qualification}</p>
                                    <p><strong>University:</strong> {teacher.university}</p>
                                    <p><strong>Experience:</strong> {teacher.experience} years</p>
                                    <p><strong>Certificate No:</strong> {teacher.KTET_CTET_certificateNo}</p>
                                </div>
                            </div>
                        </div>

                        {/* Documents Section */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Eligibility Documents ({teacher.eligibilityDocuments.length})
                            </h4>

                            {teacher.eligibilityDocuments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No documents uploaded</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {teacher.eligibilityDocuments.map((doc, idx) => {
                                        const fileName = getFileNameFromUrl(doc, idx);
                                        const isImage = isImageFile(doc);
                                        const isPdf = isPdfFile(doc);

                                        return (
                                            <Card key={idx} className="p-4 hover:shadow-md transition-shadow">
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <h5 className="font-medium text-sm truncate">{fileName}</h5>
                                                        <Badge>
                                                            {isImage ? 'Image' : isPdf ? 'PDF' : 'Document'}
                                                        </Badge>
                                                    </div>

                                                    {/* Document Preview */}
                                                    <div className="border rounded-lg overflow-hidden bg-gray-50">
                                                        {isImage ? (
                                                            <img
                                                                src={doc}
                                                                alt={fileName}
                                                                className="w-full h-32 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                                onClick={() => window.open(doc, '_blank')}
                                                            />
                                                        ) : isPdf ? (
                                                            <div className="h-32 flex items-center justify-center text-gray-500">
                                                                <div className="text-center">
                                                                    <FileText className="h-8 w-8 mx-auto mb-2" />
                                                                    <p className="text-xs">PDF Document</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="h-32 flex items-center justify-center text-gray-500">
                                                                <div className="text-center">
                                                                    <FileText className="h-8 w-8 mx-auto mb-2" />
                                                                    <p className="text-xs">Document</p>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-xs"
                                                            onClick={() => window.open(doc, '_blank')}
                                                        >
                                                            <ExternalLink className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1 text-xs"
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

                        {/* Action Buttons for Teacher */}
                        {teacher.status === 'pending' && (
                            <div className="border-t pt-4">
                                <div className="flex gap-4 justify-end">
                                    <Button
                                        variant="destructive"
                                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
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
                </ScrollArea>
            </DialogContent>
            <ConfirmModal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={handleConfirmReject}
                title="Reject Application?"
                description="Are you sure you want to reject this teacher’s application? This action cannot be undone."
            />
        </Dialog>
    );
};

export default TeacherDetailsModal;