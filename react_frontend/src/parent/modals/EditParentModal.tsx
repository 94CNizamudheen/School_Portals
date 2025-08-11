import React, { useEffect, useState } from "react";

interface Parent {
  name: string;
  email: string;
  mobileNumber: string;
}

interface ParentEditModalProps {
  parent: Parent | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedParent: { email: string; mobileNumber: string }) => void;
}

const ParentEditModal: React.FC<ParentEditModalProps> = ({ parent, isOpen,onClose,onSave,}) => {
  const [email, setEmail] = useState(parent?.email || "");
  const [mobileNumber, setMobileNumber] = useState(parent?.mobileNumber || "");

  useEffect(() => {
    if (parent) {
      setEmail(parent.email);
      setMobileNumber(parent.mobileNumber);
    }
  }, [parent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ email, mobileNumber });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800/60 border border-white/10 rounded-3xl p-6  max-w-md shadow-xl">
        <h2 className="text-lg font-semibold text-white mb-4">
          Edit Parent Info
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mobile */}
          <div>
            <label className="block text-xs text-white/70 mb-1">Mobile</label>
            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs text-white/70 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500/70 hover:bg-gray-500 text-white rounded-lg px-3 py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg px-3 py-2 text-sm font-medium"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentEditModal;
