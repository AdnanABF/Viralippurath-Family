const AdminTopbar = () => {
  return (
    <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8">
      <span className="text-sm text-stone-500">
        Viralippurath Administration
      </span>

      {/* Mock user */}
      <div className="text-sm font-medium text-stone-700">Super Admin</div>
    </header>
  );
};

export default AdminTopbar;
