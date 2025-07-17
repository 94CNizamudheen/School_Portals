// src/admin/pages/TeachersPage.tsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchTeachers } from "../../store/teacherThunks";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

 const TeachersPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { teachers, loading } = useSelector((state: RootState) => state.teacher);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    dispatch(fetchTeachers());
  }, [dispatch]);

  const filtered = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginated = filtered.slice(start, start + pageSize);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Search here..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-64"
        />
        <Link to='/admin/teachers/add'>
          <Button>+ New Teacher</Button>
        </Link>
      
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginated.map(teacher => (
            <Card key={teacher._id} className="text-center">
              <CardHeader>
                <div className="mx-auto w-20 h-20 bg-purple-200 rounded-full" />
                <CardTitle className="mt-2">{teacher.name}</CardTitle>
                <p className="text-sm text-gray-500">{teacher.subject}</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-4">
                  <Button size="icon" variant="ghost">📞</Button>
                  <Button size="icon" variant="ghost">📧</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm">Showing {start + 1} - {Math.min(start + pageSize, filtered.length)} of {filtered.length} teachers</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <Button key={i} variant={i + 1 === page ? "default" : "outline"} size="icon" onClick={() => setPage(i + 1)}>
              {i + 1}
            </Button>
          ))}
          <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
export default TeachersPage