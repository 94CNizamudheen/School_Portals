import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState,AppDispatch } from "../../../store/store"; 
import { fetchAllDivisions,createDivision, deleteDivisionById, assignClassTeacher, addStudentToDivision, removeStudentFromDivision } from "../../../store/divisionThunks"; 
import type{ ClassDivision } from "../../../types/division.types";


export default function ClassDivisionManagementPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { divisions, loading } = useSelector((state: RootState) => state.divisions);
  const  teachers  = useSelector((state: RootState) => state.teacher.approved);
  const  students  = useSelector((state: RootState) => state.student.students);

  useEffect(() => {
    dispatch(fetchAllDivisions());
  }, [dispatch]);

  const handleCreateDivision = () => {
    const name = prompt("Enter division name (e.g., 1-A):");
    if (name) {
      dispatch(createDivision({  divisionName: name, subjects: [], classTeacherId: "", assignedStudentsId: [],_id: "" }));
    }
  };

  const handleDeleteDivision = (divisionId: string) => {
    if (confirm("Delete this division?")) {
      dispatch(deleteDivisionById(divisionId));
    }
  };

  const handleAssignTeacher = (divisionId: string, teacherId: string) => {
    dispatch(assignClassTeacher({ divisionId, teacherId }));
  };

  const handleAddStudent = (divisionId: string) => {
    const studentId = prompt("Enter student Mongo ID:");
    if (studentId) {
      dispatch(addStudentToDivision({ divisionId, studentId }));
    }
  };

  const handleRemoveStudent = (divisionId: string, studentId: string) => {
    dispatch(removeStudentFromDivision({ divisionId, studentId }));
  };

  const getTeacherName = (id: string) => {
    const teacher = teachers.find(t => t._id === id);
    return teacher ? `${teacher.firstName} ${teacher.lastName} `: "Unassigned";
  };

  const getStudentName = (id: string) => {
    const student = students.find(s => s._id === id);
    return student ? student.firstName : id;
  };

  const getAvailableTeachers = () => {
    const assignedIds = divisions.map(d => d.classTeacherId).filter(Boolean);
    return teachers.filter(t => !assignedIds.includes(t._id));
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl text-white font-bold">Class Divisions</h1>
        <button
          onClick={handleCreateDivision}
          className="bg-blue-500 px-4 py-2 rounded text-white"
        >
          + Create Division
        </button>
      </div>

      {divisions.map((division: ClassDivision) => (
        <div key={division._id} className="bg-gray-800 p-4 rounded mb-4">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold text-white">{division.divisionName}</h2>
            <button
              onClick={() => handleDeleteDivision(division._id)}
              className="text-red-400"
            >
              Delete
            </button>
          </div>

          {/* Teacher Assignment */}
          <div className="mt-2">
            <label className="text-gray-300 mr-2">Class Teacher:</label>
            <select
              value={division.classTeacherId || ""}
              onChange={(e) => handleAssignTeacher(division._id, e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1"
            >
              <option value="">-- Select Teacher --</option>
              {getAvailableTeachers().map(t => (
                <option key={t._id} value={t._id}>
                  {`${t.firstName} ${t.lastName}`}
                </option>
              ))}
              {division.classTeacherId && !getAvailableTeachers().some(t => t._id === division.classTeacherId) && (
                <option value={division.classTeacherId}>{getTeacherName(division.classTeacherId)}</option>
              )}
            </select>
          </div>

          {/* Assigned Students */}
          <div className="mt-4">
            <h3 className="text-gray-300 font-semibold mb-1">Students</h3>
            {division.assignedStudentsId?.length ? (
              <ul className="list-disc pl-6 text-white">
                {division.assignedStudentsId.map((sid) => (
                  <li key={sid} className="flex justify-between items-center">
                    {getStudentName(sid)}
                    <button
                      onClick={() => handleRemoveStudent(division._id, sid)}
                      className="text-red-400"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No students assigned</p>
            )}
            <button
              onClick={() => handleAddStudent(division._id)}
              className="bg-green-500 px-3 py-1 rounded mt-2"
            >
              + Add Student
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
