
import { X } from "lucide-react";
import { useState } from "react";

interface EditTeacherModalProps {
  teacher: {
    email: string;
    mobileNumber: string;
    profileImage?: string;
  };
  onClose: () => void;
  onSave: (data: { email?: string; mobileNumber?: string; profileImage?: File | null }) => void;
}

export default function EditTeacherModal({ teacher, onClose, onSave }: EditTeacherModalProps) {
  const [email, setEmail] = useState(teacher.email);
  const [mobileNumber, setMobileNumber] = useState(teacher.mobileNumber);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>(teacher.profileImage || "/default-avatar.png");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ email, mobileNumber, profileImage });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background blur */}
      <div className="absolute inset-0 bg-[#090625]/80 backdrop-blur-lg"></div>

      {/* Modal */}
      <div className="relative bg-white/10 border border-white/20 rounded-2xl p-6  max-w-md text-white shadow-xl animate-fadeIn">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-3 right-3 text-white hover:text-red-400">
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center">Edit Teacher Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Profile Image Upload */}
          <div className="flex flex-col items-center">
            <img src={preview} alt="Preview" className="w-20 h-20 rounded-full border-2 border-white mb-2" />
            <label className="cursor-pointer text-sm bg-white/20 px-3 py-1 rounded-lg hover:bg-white/30">
              Change Photo
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-pink-400"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm mb-1">Mobile Number</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-pink-400"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-600 transition-colors text-white py-2 rounded-lg"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
