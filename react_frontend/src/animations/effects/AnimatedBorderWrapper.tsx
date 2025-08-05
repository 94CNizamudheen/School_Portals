
import React from "react";
import "../../css/animatedBorder.css"; 

export const AnimatedBorderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative rounded-3xl border-wrapper p-[2px]">
      <div className="rounded-3xl backdrop-blur-sm shadow-2xl overflow-hidden">
        {children}
      </div>
    </div>
  );
};