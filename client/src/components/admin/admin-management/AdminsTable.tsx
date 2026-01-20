import { ShieldCheck, Shield, Clock } from "lucide-react";
import type { AdminUser } from "../../../types/admin.management";
import AdminStatusBadge from "./AdminStatusBadge";
import { formatDateTime } from "../../../utils/date";
import {
  DeleteButton,
  EditButton,
  TableGrid,
  type ColumnConfig,
} from "../../ui";

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
  // 1. Define Columns for Desktop
  const columns: ColumnConfig<AdminUser>[] = [
    {
      header: "Full Name",
      render: (admin) => (
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-900">{admin.fullName}</span>
          {admin.isCreator && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded-md border border-amber-200">
              <ShieldCheck size={12} />
              Founder
            </span>
          )}
          {admin.uuid === currentUserUuid && (
            <span className="text-[10px] bg-amber-700 text-white px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">
              You
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Username",
      className:"text-sm",
      render: (admin) => (
        <span className="text-stone-600">{admin.username}</span>
      ),
    },
    {
      header: "Role",
      render: (admin) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            admin.role === "SUPER_ADMIN"
              ? "bg-amber-50 text-amber-700 border-amber-100"
              : "bg-blue-50 text-blue-700 border-blue-100"
          }`}
        >
          {admin.role.replace("_", " ")}
        </span>
      ),
    },
    {
      header: "Last Login",
      className:"text-sm",
      render: (admin) => (
        <span className="text-stone-500">
          {admin.lastLogin
            ? formatDateTime(admin.lastLogin)
            : "Never logged in"}
        </span>
      ),
    },
    {
      header: "Status",
      render: (admin) => <AdminStatusBadge isActive={admin.isActive} />,
    },
    {
      header: "Actions",
      className: "justify-end text-right", // Aligns the header and cell content to the right
      render: (admin) => {
        const isSelf = admin.uuid === currentUserUuid;
        return (
          <div className="flex items-center gap-2">
            {(!admin.isCreator || (admin.isCreator && isSelf)) && (
              <EditButton
                disabled={disabled}
                onClick={() => onEdit(admin)}
                variant="normal"
              />
            )}
            {!admin.isCreator && (
              <DeleteButton
                disabled={disabled || isSelf}
                onClick={() => onDelete(admin.uuid)}
                variant="normal"
                title={
                  isSelf ? "You cannot delete your own account" : "Delete Admin"
                }
              />
            )}
          </div>
        );
      },
    },
  ];

  // 2. Define Mobile Card
  const renderMobileCard = (admin: AdminUser) => {
    const isSelf = admin.uuid === currentUserUuid;
    return (
      <div
        className={`bg-white border rounded-2xl p-4 shadow-sm transition-all ${
          isSelf ? "border-amber-200 ring-1 ring-amber-100" : "border-stone-200"
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
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
                {admin.isCreator && (
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
          {(!admin.isCreator || (admin.isCreator && isSelf)) && (
            <EditButton
              disabled={disabled}
              onClick={() => onEdit(admin)}
              variant="mobile"
            />
          )}
          {!admin.isCreator && (
            <DeleteButton
              disabled={disabled || isSelf}
              onClick={() => onDelete(admin.uuid)}
              variant="mobile"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <TableGrid
      data={admins}
      columns={columns}
      gridTemplate="grid-cols-[1fr_1fr_1fr_1fr_0.5fr_1fr]"
      keyExtractor={(admin) => admin.uuid}
      renderMobileCard={renderMobileCard}
    />
  );
};

export default AdminsTable;
