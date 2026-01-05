interface Props {
  isActive: boolean;
}

const AdminStatusBadge: React.FC<Props> = ({ isActive }) => {
  return isActive ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200">
      Disabled
    </span>
  );
};

export default AdminStatusBadge;
