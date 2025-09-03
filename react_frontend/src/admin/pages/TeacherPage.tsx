import { useEffect, useState } from "react";
import { deleteTeacher, fetchTeachers } from "../../store/teacherSlice";
import { Card, CardContent, CardHeader, CardTitle, } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import StatusFilterWithSearch from "../../components/shared/filters";
import { CustomPagination, } from "../../components/shared/CustomPagination";
import { Mail, Phone, GraduationCap, MoreHorizontal, Eye, Trash2, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "../../components/ui/dropdown-menu";
import ConfirmModal from "../components/modals/ConfirmDeleteModal";
import { useNotification } from "../../context/notification/useNotification";
import { useAppDispatch, useAppSelector } from "../../hooks/app.hooks";

const TeachersPage = () => {
  const dispatch = useAppDispatch();
  const navigate= useNavigate()
  const teachers = useAppSelector((state ) => state.teacher.approved);
  const loading = useAppSelector((state) => state.teacher.loading);
  const {showNotification}=useNotification()

  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;


  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterValue === "all" ||
      teacher.subject?.toLowerCase() === filterValue.toLowerCase();

    return matchesSearch && matchesFilter;
  }).sort((a,b)=>new Date(b.createdAt).getTime()- new Date(a.createdAt).getTime());

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
  
  useEffect(()=>{
    dispatch(fetchTeachers())
  },[dispatch])

  return (
    <div className="min-h-screen bg-gradient-to-br p-6">
      {/* Header Section with Glass Morphism */}
      <div className="mb-8">
        <div className="backdrop-blur-sm bg-white/30 rounded-3xl p-8 border border-white/20 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Teachers Management
              </h1>
              <p className="text-gray-600 mt-1">Manage and oversee all approved teachers</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-auto">
              <StatusFilterWithSearch
                onSearchChange={setSearchQuery}
                onFilterChange={setFilterValue}
              />
            </div>
            <Link to="/admin/teachers/review-and-verify" className="w-full lg:w-auto">
              <Button 
                className="w-full lg:w-auto bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-900 hover:to-black text-white font-semibold px-8 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                size="lg"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Review & Verify Teachers
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-300 rounded-full animate-spin border-t-gray-600"></div>
            <p className="text-gray-600 mt-4 text-center font-medium">Loading teachers...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Teachers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedTeachers.map((teacher) => (
              <Card
                key={teacher._id}
                className="group relative overflow-hidden bg-gradient-to-br from-white via-gray-500 to-white  backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-500 rounded-3xl"
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/80 to-gray-50/90 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute z-20 top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-gray-800 rounded-xl shadow-lg transition-all duration-300 opacity-80 hover:opacity-100"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-48 bg-white backdrop-blur-lg border border-gray-200 shadow-xl rounded-2xl p-2 z-30"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate(`/admin/teachers/${teacher._id}`)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-gray-700">View Details</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteClick(teacher._id)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 cursor-pointer transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-600">Remove</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <CardHeader className="relative z-10 text-center pt-8 pb-4">
                  {/* Enhanced Avatar */}
                  <div className="relative mx-auto mb-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                      <img
                        src={teacher.profileImage || "/default-avatar.png"}
                        alt={`${teacher.firstName} ${teacher.lastName}`}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    {/* Online Status Indicator */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-lg"></div>
                  </div>

                  <CardTitle className="text-gray-800 text-xl font-bold mb-2 group-hover:text-gray-900 transition-colors duration-300">
                    {teacher.firstName} {teacher.lastName}
                  </CardTitle>
                  
                  <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 rounded-full">
                    <GraduationCap className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">{teacher.subject}</span>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 px-6 pb-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Phone className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{teacher.mobileNumber}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50/80 rounded-2xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Mail className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate flex-1">
                      {teacher.email}
                    </span>
                  </div>
                </CardContent>

                {/* Hover Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredTeachers.length === 0 && (
            <div className="text-center py-20">
              <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No teachers found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}

          <ConfirmModal
            open={showConfirm}
            onClose={() => setShowConfirm(false)}
            onConfirm={confirmDelete}
          />
        </>
      )}

      {/* Enhanced Pagination */}
      {filteredTeachers.length > 0 && (
        <div className="mt-8">
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default TeachersPage;