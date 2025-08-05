import { Mail, Phone, MapPin, FileText, CalendarDays, BadgeCheck } from "lucide-react";
import { Card } from "../../components/ui/card";
import type { Teacher } from "../../types/teacher.types";

interface Props {
  teacher: Teacher;
}

const TeacherDetailsCard: React.FC<Props> = ({ teacher }) => {
  if (!teacher) return <p>No teacher data provided</p>;

  const isImageFile = (url: string): boolean => {
    const ext = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    return ext.some((e) => url.toLowerCase().includes(e));
  };

  const formatDate = (isoDate: string): string =>
    new Date(isoDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-850 to-gray-500 text-white p-6 rounded-t-xl border-1 border-gray-500">
          <div className="flex items-center gap-6">
            <img
              src={teacher.profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full border-4 border-white object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">
                {teacher.firstName} {teacher.lastName}
              </h1>
              <p className="text-gray-200 text-sm capitalize">{teacher.subject} Teacher</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white p-6 space-y-6">
          {/* Contact & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-red-500" />
              <span>{teacher.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-red-500" />
              <span>{teacher.mobileNumber}</span>
            </div>
            <div className="flex items-center gap-2 col-span-full">
              <MapPin className="h-4 w-4 text-red-500" />
              <span>
                {teacher.address?.addressLine}, {teacher.address?.city},{" "}
                {teacher.address?.state} - {teacher.address?.pincode}
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-500" />
              <span>Date of Birth: {formatDate(teacher.dob)}</span>
            </div>

            <div className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-green-500" />
              <span>Teaching Experience: {teacher.experience} years</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Joined School On:</span>
              <strong>{formatDate(teacher.experienceStartDate!)}</strong>
            </div>

            <div className="flex items-center gap-2">
              <span>Certificate No:</span>
              <strong>{teacher.KTET_CTET_certificateNo}</strong>
            </div>

            <div className="flex items-center gap-2">
              <span>Qualification:</span>
              <strong>{teacher.qualification}</strong>
            </div>

            <div className="flex items-center gap-2">
              <span>University:</span>
              <strong>{teacher.university}</strong>
            </div>
          </div>


          {/* Documents */}
          <div>
            <h3 className="font-semibold text-lg text-[#1d1b58] mb-2">Documents:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {teacher.eligibilityDocuments.map((doc, index) => (
                <Card
                  key={index}
                  className="p-3 hover:shadow-xl cursor-pointer transition-all"
                  onClick={() => window.open(doc, "_blank")}
                >
                  {isImageFile(doc) ? (
                    <img
                      src={doc}
                      alt={`Document ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="text-center text-gray-500 text-sm">
                      <FileText className="w-6 h-6 mx-auto mb-1" />
                      PDF Document
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsCard;
