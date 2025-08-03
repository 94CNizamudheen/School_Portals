import React from 'react';
import { CheckCircle, X, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';

interface AdmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewApplication: () => void;
}

const ApplicationSuucessModal: React.FC<AdmissionSuccessModalProps> = ({  isOpen, onClose, onViewApplication }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-w-[50%] mx-4 transform transition-all duration-300 scale-100 overflow-hidden">
        {/* Colorful Header Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-4 left-4">
          <Sparkles className="w-6 h-6 text-white/70 animate-pulse" />
        </div>
        <div className="absolute top-8 right-12">
          <Sparkles className="w-4 h-4 text-white/60 animate-pulse delay-300" />
        </div>
        <div className="absolute top-16 left-16">
          <Sparkles className="w-5 h-5 text-white/50 animate-pulse delay-700" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="relative p-8 pt-20 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg transform -translate-y-10">
            <CheckCircle className="w-10 h-10 text-white drop-shadow-lg" />
          </div>

          {/* School Icon */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 -translate-y-2">
            <GraduationCap className="w-8 h-8 text-white/90" />
          </div>

          {/* Success Message */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Welcome Aboard! 🎉
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed text-lg">
            Your  application has been successfully submitted! Get ready for an amazing educational journey.
          </p>

          {/* Fun Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
              <div className="text-2xl font-bold text-blue-600">✓</div>
              <div className="text-sm text-blue-700 font-medium">Application</div>
              <div className="text-xs text-blue-600">Submitted</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4">
              <div className="text-2xl font-bold text-purple-600">📚</div>
              <div className="text-sm text-purple-700 font-medium">Next Step</div>
              <div className="text-xs text-purple-600">Review</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onViewApplication}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>View My Application</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-2xl transition-all duration-200 hover:shadow-md"
            >
              Continue Exploring
            </button>
          </div>

          {/* Encouraging Message */}
          <p className="text-sm text-gray-500 mt-6 font-medium">
            🌟 You're one step closer to your dreams!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSuucessModal;