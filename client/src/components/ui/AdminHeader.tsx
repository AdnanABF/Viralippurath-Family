import React from "react";

interface AdminHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const AdminHeader = ({ title, description, children }: AdminHeaderProps) => {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
      {/* Left Side: Identity */}
      <div>
        <h1 className="text-2xl font-serif text-stone-900">{title}</h1>
        <p className="text-stone-500 text-sm mt-1">{description}</p>
      </div>

      {/* Right Side: Responsive Container for all Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full xl:w-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminHeader;
