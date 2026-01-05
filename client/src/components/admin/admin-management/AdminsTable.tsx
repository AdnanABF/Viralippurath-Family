import { PenLine, Trash2 } from "lucide-react";
import type { AdminUser } from "../../../types/admin.management";
import AdminStatusBadge from "./AdminStatusBadge";
import { formatDateTime } from "../../../utils/date";

interface Props {
  admins: AdminUser[];
  onEdit: (admin: AdminUser) => void;
  onDelete: (uuid: string) => void;
  disabled?: boolean;
  currentUserUuid?: string;
}

const AdminsTable: React.FC<Props> = ({
  admins,
  onEdit,
  onDelete,
  disabled,
  currentUserUuid,
}) => {
  return (
    <div className="w-full bg-white border border-stone-200 overflow-hidden">
      <div className="overflow-x-auto">
        {/* min-w-225 matches EventsTable to ensure consistent scrolling behavior */}
        <table className="w-full min-w-225 border-collapse">
          <thead className="bg-stone-50 text-sm text-stone-600 border-b border-stone-200">
            <tr>
              <th className="p-4 text-left font-semibold">Full Name</th>
              <th className="p-4 text-left font-semibold">Username</th>
              <th className="p-4 text-left font-semibold">Role</th>
              <th className="p-4 text-left font-semibold">Last Login</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {admins.map((admin) => {
              const isSelf = admin.uuid === currentUserUuid;
              return (
                <tr
                  key={admin.uuid}
                  className="hover:bg-stone-50/50 transition-colors"
                >
                  <td className="p-4 font-medium text-stone-900">
                    <div className="flex items-center gap-2">
                      {admin.fullName}
                      {isSelf && (
                        <span className="text-[10px] bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-stone-600">
                    {admin.username}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        admin.role === "SUPER_ADMIN"
                          ? "bg-amber-50 text-amber-700 border-amber-100"
                          : "bg-blue-50 text-blue-700 border-blue-100"
                      }`}
                    >
                      {admin.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-stone-500">
                    {admin.lastLogin ? (
                      formatDateTime(admin.lastLogin)
                    ) : (
                      <span className="text-stone-300 italic">
                        Never logged in
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {/* Assuming this badge uses similar styling to EventStatusBadge */}
                    <AdminStatusBadge isActive={admin.isActive} />
                  </td>
                  <td className="p-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        disabled={disabled}
                        onClick={() => onEdit(admin)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50 hover:border-amber-700 hover:text-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PenLine size={14}/> <span>Edit</span>
                      </button>
                      <button
                        disabled={disabled || isSelf}
                        onClick={() => onDelete(admin.uuid)}
                        title={
                          isSelf
                            ? "You cannot delete your own account"
                            : "Delete Admin"
                        }
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-stone-200 text-red-600 hover:bg-red-50 hover:border-red-200 transition-all disabled:bg-stone-100 disabled:text-stone-400 disabled:border-stone-200 disabled:cursor-not-allowed min-w-21.25"
                      >
                        <Trash2 size={14}/> <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminsTable;
