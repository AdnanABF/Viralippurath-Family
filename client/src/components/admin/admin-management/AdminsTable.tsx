import { Shield, ShieldCheck, Clock } from "lucide-react";
import type { AdminUser } from "../../../types/admin.management";
import AdminStatusBadge from "./AdminStatusBadge";
import { formatDateTime } from "../../../utils/date";
import { DeleteButton, EditButton } from "../../ui";

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
    <div className="w-full">
      {/* --- MOBILE VIEW: Admin User Cards --- */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {admins.map((admin) => {
          const isCreator = admin.isCreator;
          const isSelf = admin.uuid === currentUserUuid;
          return (
            <div
              key={admin.uuid}
              className={`bg-white border rounded-2xl p-4 shadow-sm transition-all ${
                isSelf
                  ? "border-amber-200 ring-1 ring-amber-100"
                  : "border-stone-200"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                    ${
                      admin.role === "SUPER_ADMIN"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {admin.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-stone-900 flex items-center gap-2">
                      {admin.fullName}
                      {isCreator && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-md border border-amber-200">
                          <ShieldCheck size={12} />
                          Founder
                        </span>
                      )}
                      {isSelf && (
                        <span className="text-[10px] bg-amber-700 text-white px-1.5 py-0.5 rounded uppercase font-bold">
                          You
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-stone-500">{admin.username}</p>
                  </div>
                </div>
                <AdminStatusBadge isActive={admin.isActive} />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Shield size={14} className="text-stone-400" />
                  <span className="capitalize">
                    {admin.role.toLowerCase().replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-stone-600">
                  <Clock size={14} className="text-stone-400" />
                  <span>
                    {admin.lastLogin
                      ? formatDateTime(admin.lastLogin)
                      : "Never logged in"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                {(!isCreator || (isCreator && isSelf)) && (
                  <EditButton
                    disabled={disabled}
                    onClick={() => onEdit(admin)}
                    variant="mobile"
                  />
                )}
                {!isCreator && (
                  <DeleteButton
                    disabled={disabled || isSelf}
                    onClick={() => onDelete(admin.uuid)}
                    variant="mobile"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- DESKTOP VIEW: Table --- */}
      <div className="hidden lg:block w-full bg-white border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
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
                const isCreator = admin.isCreator;
                const isSelf = admin.uuid === currentUserUuid;
                return (
                  <tr
                    key={admin.uuid}
                    className="hover:bg-stone-50/50 transition-colors group"
                  >
                    <td className="p-4 font-medium text-stone-900">
                      <div className="flex items-center gap-2">
                        {admin.fullName}
                        {isCreator && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-md border border-amber-200">
                            <ShieldCheck size={12} />
                            Founder
                          </span>
                        )}
                        {isSelf && (
                          <span className="text-[10px] bg-amber-700 text-white px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
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
                      {admin.lastLogin
                        ? formatDateTime(admin.lastLogin)
                        : "Never logged in"}
                    </td>
                    <td className="p-4">
                      <AdminStatusBadge isActive={admin.isActive} />
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        {(!isCreator || (isCreator && isSelf)) && (
                          <EditButton
                            disabled={disabled}
                            onClick={() => onEdit(admin)}
                            variant="normal"
                          />
                        )}
                        {!isCreator && (
                          <DeleteButton
                            disabled={disabled || isSelf}
                            onClick={() => onDelete(admin.uuid)}
                            variant="normal"
                            title={
                              isSelf
                                ? "You cannot delete your own account"
                                : "Delete Admin"
                            }
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminsTable;
