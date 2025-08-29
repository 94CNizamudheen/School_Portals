import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../types/store.types"; 
import { updateStudent } from "../../store/studentSlice";
import { useNotification } from "../../context/notification/useNotification";
import type { AxiosError } from "axios";
import { X } from "lucide-react";

interface EditMedicalInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    studentId: string;
    initialData?: string;
}

const EditMedicalInfoModal = ({ isOpen, onClose, studentId, initialData = "", }: EditMedicalInfoModalProps) => {
    const {showNotification}= useNotification()
    const dispatch = useDispatch<AppDispatch>();
    const [medicalInfo, setMedicalInfo] = useState(initialData);

    if (!isOpen) return null;

    const handleSave = async () => {
        try {
            await dispatch(updateStudent({ id: studentId, updates: { medicalInformation: medicalInfo } })).unwrap();
            onClose();
            showNotification('success',{message:"medical information saved"})
        } catch (err) {
            const error = err as AxiosError<{message:string}>
            showNotification('success',{message: error.response?.data?.message })
        }
    };

   return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Dark blurred background */}
      <div className="absolute inset-0 bg-[#090625]/80 backdrop-blur-sm"></div>

      {/* Modal */}
      <div className="relative bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md  text-white shadow-xl animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-red-400"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4 text-center">
          Edit Medical Information
        </h2>

        <textarea
          className="w-full px-3 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-pink-400 h-32 resize-none"
          value={medicalInfo}
          onChange={(e) => setMedicalInfo(e.target.value)}
          placeholder="Enter medical information..."
        />

        <div className="flex justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMedicalInfoModal;
