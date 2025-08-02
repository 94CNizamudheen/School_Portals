import { LogOut, X } from "lucide-react";
import type React from "react";

interface LogoutModalProps{
    isOpen:boolean;
    onClose:()=>void;
    onConfirm:()=>void
}


const LogoutConfirmModal:React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-2xl shadow-xl max-w-md mx-4 transform transition-all duration-300 scale-100 border border-purple-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-800 to-indigo-700 bg-clip-text text-transparent">Confirm Logout</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          <p className="text-gray-700 mb-6 leading-relaxed">
            Are you sure you want to log out? You'll need to sign in again to access your account.
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] border border-white/50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-purple-200"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LogoutConfirmModal