import React from "react";

interface AdminControlGroupProps {
  children: React.ReactNode;
  className?: string; // Optional custom classes
}

const AdminControlGroup = ({
  children,
  className = "",
}: AdminControlGroupProps) => (
  <div className={`flex items-center gap-2 w-full md:w-auto ${className}`}>
    {children}
  </div>
);

export default AdminControlGroup;
