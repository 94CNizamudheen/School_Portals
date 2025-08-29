
import { useParams } from "react-router-dom";


import TeacherDetailsCard from "../components/TeacherDetailsCard";
import { useAppSelector } from "../../hooks/app.hooks";

const TeacherDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const teacher = useAppSelector((state) =>
    state.teacher.approved.find((t) => t._id === id)
  );

  if (!teacher) return <div className="p-6 text-center text-gray-600">Teacher not found</div>;
  return (
    <div className="p-6">
      <TeacherDetailsCard teacher={teacher} />
    </div>
  );
};

export default TeacherDetailsPage;
