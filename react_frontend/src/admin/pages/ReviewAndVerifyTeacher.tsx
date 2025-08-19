import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

import StatusFilterWithSearch from "../../components/shared/filters";
import { CustomPagination } from "../../components/shared/CustomPagination";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { User, Mail, Phone, Calendar, BookOpen, Award, FileText, Eye } from "lucide-react";
import TeacherDetailsModal from "../components/modals/ViewTeacherDetails";
import type { Teacher } from "../../types/teacher.types";
import { rejectApplication, verifyTeacher } from "../../store/teacherThunks";
import ProcessingSpinner from "../../components/shared/ProcessingSpinner";
import { useNotification } from "../../context/notification/useNotification";


const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'verified': return 'default';
    case 'pending': return 'secondary';
    case 'rejected': return 'destructive';
    default: return 'outline';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'verified': return 'text-green-600 bg-green-50';
    case 'pending': return 'text-yellow-600 bg-yellow-50';
    case 'rejected': return 'text-red-600 bg-red-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

const ReviewAndVerifyTeachersPage: React.FC = () => {
  const appliedTeachers = useSelector((state: RootState) => state.teacher.applied)
  const loading = useSelector((state: RootState) => state.teacher.loading);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>()
  const {showNotification}= useNotification()

  const itemsPerPage = 8;

  useEffect(() => {
    let filtered = [...appliedTeachers];
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((t) =>
        `${t.firstName} ${t.lastName} ${t.email} ${t.subject}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTeachers(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [statusFilter, searchQuery, appliedTeachers,]);

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  console.log("statusFilter", statusFilter);
  const handleStatusChange = (status: string) => setStatusFilter(status);
  const handleSearchQuery = (query: string) => setSearchQuery(query);

  const handleVerify = async (teacherId: string) => {
    try {
      await dispatch(verifyTeacher(teacherId)).unwrap()
      showNotification('success',{message:`Successfully verified the teacher`})
    } catch (error) {
      showNotification('error',{message:error as string})
    }
  };

  const handleReject = async (teacherId: string) => {
    try {
      await dispatch(rejectApplication(teacherId)).unwrap()
      showNotification('success',{message:`Application rejected`})
    } catch (error) {
       showNotification('error',{message:error as string})
    }
  };

  const handleViewDetails = (teacherId: string) => {
    const teacher = filteredTeachers.find(t => t._id === teacherId);
    if (teacher) {
      setSelectedTeacher(teacher);
      setIsDocumentModalOpen(true);
    }
  };

  return (
    <>

      {loading && (
        <ProcessingSpinner/>
      )}
      <div className="min-h-screen ">
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center">
              <div>
                <h1 className="text-4xl font-bold ">
                  Teacher Applications
                </h1>
                <p className="text-gray-600 mt-2">Review and verify teacher applications</p>
              </div>
              <StatusFilterWithSearch
                onFilterChange={handleStatusChange}
                onSearchChange={handleSearchQuery}
              />
            </div>
          </div>

          {/* Content Section */}
          {paginatedTeachers.length === 0 ? (
            <div className="text-center py-16">
              <User className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No applications found</h3>
              <p className="text-gray-500">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <>
              {/* Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedTeachers.map((teacher) => (
                  <Card
                    key={teacher._id}
                    className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-gray-100 backdrop-blur-sm border-0 shadow-lg"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col items-center text-center space-y-3">
                        {/* Profile Picture */}
                        <div className="relative h-16 w-16 ring-4 ring-purple-100 rounded-full overflow-hidden">
                          {teacher.profileImage ? (
                            <img
                              src={teacher.profileImage}
                              alt={`${teacher.firstName} ${teacher.lastName}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center text-white font-semibold text-lg">
                              {teacher.firstName.charAt(0)}{teacher.lastName.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Name and Status */}
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-semibold text-gray-800">
                            {teacher.firstName} {teacher.lastName}
                          </CardTitle>
                          <Badge
                            variant={getStatusBadgeVariant(teacher.status)}
                            className={`capitalize ${getStatusColor(teacher.status)}`}
                          >
                            {teacher.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pt-0">
                      {/* Contact Info */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4 text-purple-500" />
                          <span className="truncate">{teacher.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="h-4 w-4 text-purple-500" />
                          <span>{teacher.mobileNumber}</span>
                        </div>
                      </div>

                      {/* Key Details */}
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <BookOpen className="h-4 w-4 text-indigo-500" />
                          <span className="truncate font-medium">{teacher.subject}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Award className="h-4 w-4 text-green-500" />
                          <span className="truncate">{teacher.qualification}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="h-4 w-4 text-orange-500" />
                          <span>{teacher.experience} years exp.</span>
                        </div>
                      </div>

                      {/* Documents */}
                      <div className="pt-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                          <FileText className="h-3 w-3" />
                          <span>{teacher.eligibilityDocuments.length} documents</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-xs hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                          onClick={() => handleViewDetails(teacher._id)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>


                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Teacher Details Modal */}
              <TeacherDetailsModal
                isOpen={isDocumentModalOpen}
                onClose={() => setIsDocumentModalOpen(false)}
                teacher={selectedTeacher}
                onVerify={handleVerify}
                onReject={handleReject}

              />

              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReviewAndVerifyTeachersPage;