import { useAuth } from "../../context/AuthContext";

const AdminTopbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <span className="text-sm text-stone-500">
        Viralippurath Administration
      </span>

      <div className="flex items-center gap-6">
        {/* User Info Section */}
        <div className="flex items-center gap-3 border-stone-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-stone-900 leading-none">
              {user?.fullName}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mt-1">
              {user?.role?.replace("_", " ")}
            </p>
          </div>

          {/* Simple Avatar with Initials */}
          <div className="h-9 w-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 font-bold text-xs shadow-sm">
            {user?.fullName?.charAt(0) || "A"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
