import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { deleteTeacher, fetchTeachers } from "../../store/teacherThunks";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import StatusFilterWithSearch from "../../components/shared/filters";
import { CustomPagination, } from "../../components/shared/CustomPagination";
import { Mail, Phone, GraduationCap, MoreHorizontal, } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "../../components/ui/dropdown-menu";
import ConfirmModal from "../components/modals/ConfirmDeleteModal";
import { useNotification } from "../../context/notification/useNotification";

const TeachersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate= useNavigate()
  const teachers = useSelector((state: RootState) => state.teacher.approved);
  const loading = useSelector((state: RootState) => state.teacher.loading);
  const {showNotification}=useNotification()

  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // useEffect(() => {
  //   dispatch(fetchTeachers());
  // }, [dispatch]);

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterValue === "all" ||
      teacher.subject?.toLowerCase() === filterValue.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredTeachers.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const paginatedTeachers = filteredTeachers.slice(start, start + pageSize);

  const handleDeleteClick = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedTeacherId) return;
    try {
      await dispatch(deleteTeacher(selectedTeacherId)).unwrap();
      showNotification('success',{
        title:"Teacher Remove",
        message:`Removed teacher successFully `
      })
      await dispatch(fetchTeachers());
    } catch {
      showNotification('error',{
        title:"Teacher Remove",
        message:`Removed teacher failed `
      })
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 flex-col md:flex-row gap-3">
        <StatusFilterWithSearch
          onSearchChange={setSearchQuery}
          onFilterChange={setFilterValue}
        />
        <Link to="/admin/teachers/review-and-verify">
          <Button className="bg-gradient-to-r from-gray-600 to-gray-700" >Review and Verify Teacher</Button>
        </Link>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedTeachers.map((teacher) => (
              <Card
                key={teacher._id}
                className="relative p-4 pt-6 bg-[#f4f6ff] rounded-2xl shadow-sm text-center"
              >
                {/* Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bg-gray-200 top-4 right-4 text-gray-500 hover:bg-gray-300"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-24 bg-gray-200 hover:bg-red-100">
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(teacher._id)}
                      className="text-red-600 hover:bg-red-100"
                    >
                      Remove
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => navigate(`/admin/teachers/${teacher._id}`)}
                      className="hover:bg-red-100"
                    >
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Avatar */}
                <div className="mx-auto w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow">
                  <img
                    src={teacher.profileImage || "/default-avatar.png"}
                    alt={`${teacher.firstName} ${teacher.lastName}`}
                    className="object-cover w-full h-full"
                  />
                </div>

                <CardHeader className="mt-4">
                  <CardTitle className="text-[#1d1b58] text-lg font-bold">
                    {teacher.firstName} {teacher.lastName}
                  </CardTitle>
                  <div className="flex items-center justify-center gap-2 text-[#1d1b58]">
                    <GraduationCap className="w-4 h-4" />
                    <span className="text-sm">{teacher.subject}</span>
                  </div>
                </CardHeader>

                <CardContent className="mt-2 space-y-2">
                  <div className="flex items-center justify-center gap-2 text-[#1d1b58]">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{teacher.mobileNumber}</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-[#1d1b58]">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm truncate max-w-[150px] overflow-hidden whitespace-nowrap">
                      {teacher.email}
                    </span>
                  </div>
                </CardContent>
              </Card>

            ))}
          </div>

          <ConfirmModal
            open={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={confirmDelete}
          />
        </>
      )}

      {filteredTeachers.length > 0 && (

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TeachersPage;
