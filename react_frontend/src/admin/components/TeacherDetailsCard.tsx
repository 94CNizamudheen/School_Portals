import { Mail, Phone, MapPin, FileText } from "lucide-react";
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

  const formatDate = (isoDate: string): string => {
    return new Date(isoDate).toLocaleDateString();
  };

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-850 to-gray-500 text-white p-6 rounded-t-xl relative">
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
              <p className="text-gray-200 text-sm">{teacher.subject} Teacher</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-white p-6 space-y-6">
          <div className="flex flex-wrap gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-red-500" />
              <span>
                {teacher.address.addressLine}, {teacher.address.city}, {teacher.address.state} -{" "}
                {teacher.address.pincode}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-red-500" />
              <span>{teacher.mobileNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-red-500" />
              <span>{teacher.email}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-[#1d1b58]">About:</h3>
            <p className="text-sm text-gray-700">
              Qualified {teacher.subject} teacher with {teacher.experience} years
              experience from {teacher.university}. Certificate No:{" "}
              {teacher.KTET_CTET_certificateNo}. DOB: {formatDate(teacher.dob)}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-[#1d1b58]">Education:</h3>
            <ul className="list-disc list-inside text-sm text-gray-800">
              <li>
                <strong>{teacher.qualification}</strong> - {teacher.university}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg text-[#1d1b58]">Documents:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {teacher.eligibilityDocuments.map((doc, index) => (
                <Card key={index} className="p-4">
                  {isImageFile(doc) ? (
                    <img
                      src={doc}
                      alt={`Doc ${index}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="text-gray-500 text-sm text-center">
                      <FileText className="w-6 h-6 mx-auto mb-2" />
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
