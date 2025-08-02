import React from "react";

export const SpotlightWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full flex justify-center items-center p-4">
      <div
        className="w-full max-w-[600px] animate-border rounded-2xl border border-transparent"
        style={{
          background:
            "linear-gradient(45deg,#080b11,#1e293b 50%,#172033) padding-box, conic-gradient(from var(--border-angle), rgba(100,116,139,0.48) 80%, #14b8a6 86%, #67e8f9 90%, #14b8a6 94%, rgba(100,116,139,0.48)) border-box",
        }}
      >
        <div className="rounded-2xl w-full bg-white dark:bg-black text-center px-8 py-12">
          {children}
        </div>
      </div>
    </div>
  );
};
