
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import StatusFilterWithSearch from "../../components/shared/filters"; 
import { CustomPagination } from "../../components/shared/CustomPagination";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

interface Teacher {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dob: string;
  qualification: string;
  university: string;
  experience: string;
  KTET_CTET_certificateNo: string;
  subject: string;
  eligibilityDocuments: string[]; // URLs or base64s
  status: string;
}
const ReviewAndVerifyTeachersPage: React.FC = () => {
  const appliedTeachers = useSelector((state: RootState) => state.teacher.applied);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    let filtered = [...appliedTeachers];

    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((t) =>
        `${t.firstName} ${t.lastName} ${t.email}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTeachers(filtered);
    setTotalPages(Math.ceil(filtered.length / 5));
    setCurrentPage(1);
  }, [statusFilter, searchQuery, appliedTeachers]);

  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * 5,
    currentPage * 5
  );

  const handleStatusChange = (status: string) => setStatusFilter(status);
  const handleSearchQuery = (query: string) => setSearchQuery(query);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-3xl font-bold text-purple-800">Review & Verify Teachers</h1>
        <StatusFilterWithSearch
          onFilterChange={handleStatusChange}
          onSearchChange={handleSearchQuery}
        />
      </div>

      {paginatedTeachers.length === 0 ? (
        <p className="text-center text-gray-600 mt-10">No applications found.</p>
      ) : (
        <div className="space-y-6">
          {paginatedTeachers.map((teacher) => (
            <Card key={teacher._id} className="shadow-md">
              <CardHeader>
                <CardTitle className="text-xl">
                  {teacher.firstName} {teacher.lastName} -{" "}
                  <span className="capitalize text-sm text-gray-600">{teacher.status}</span>
                </CardTitle>
                <p className="text-sm text-gray-500">{teacher.email} | {teacher.mobileNumber}</p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p><strong>DOB:</strong> {new Date(teacher.dob).toLocaleDateString()}</p>
                <p><strong>Qualification:</strong> {teacher.qualification} from {teacher.university}</p>
                <p><strong>Experience:</strong> {teacher.experience} year(s)</p>
                <p><strong>Subject:</strong> {teacher.subject}</p>
                <p><strong>Certificate No:</strong> {teacher.KTET_CTET_certificateNo}</p>

                <div className="mt-4">
                  <p className="font-medium mb-2">Eligibility Documents:</p>
                  <div className="flex gap-4 flex-wrap">
                    {teacher.eligibilityDocuments.map((doc, idx) => (
                      <a
                        key={idx}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-xs"
                      >
                        Document {idx + 1}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline">Reject</Button>
                  <Button>Verify</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ReviewAndVerifyTeachersPage;
