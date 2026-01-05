import { useState } from "react";
import type {
  AdminUser,
  AdminUserDraft,
  AdminRole,
} from "../../../types/admin.management";

interface Props {
  initial?: AdminUser;
  onSave: (admin: AdminUser | AdminUserDraft) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AdminUserForm: React.FC<Props> = ({
  initial,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [username, setUsername] = useState(initial?.username ?? "");
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>(initial?.role ?? "ADMIN");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      username,
      fullName,
      role,
      isActive,
    };

    if (password) {
      payload.password = password;
    }

    if (initial?.uuid) {
      onSave({ ...payload, uuid: initial.uuid } as AdminUser);
    } else {
      onSave(payload as AdminUserDraft);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="bg-stone-50 border border-stone-200 rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-xl font-serif text-stone-800">
        {initial?.uuid ? "Edit Admin Account" : "Create New Admin"}
      </h2>

      {/* Full Name */}
      <div className="space-y-1">
        <label className="text-sm font-semibold text-stone-700">
          Full Name
        </label>
        <input
          required
          disabled={isLoading}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          placeholder="e.g. John Doe"
        />
      </div>

      {/* Grid for Username and Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            Username
          </label>
          <input
            required
            disabled={isLoading}
            autoComplete="none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
            placeholder="johndoe"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            {initial?.uuid ? "New Password (Optional)" : "Password"}
          </label>
          <input
            required={!initial?.uuid}
            type="password"
            disabled={isLoading}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
            placeholder={initial?.uuid ? "••••••••" : "Min. 6 chars"}
            minLength={8}
          />
        </div>
      </div>

      {/* Role + Status Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">Role</label>
          <select
            disabled={isLoading}
            value={role}
            onChange={(e) => setRole(e.target.value as AdminRole)}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          >
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="MEMBER">Member</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-stone-700">
            Account Status
          </label>
          <select
            disabled={isLoading}
            value={isActive ? "true" : "false"}
            onChange={(e) => setIsActive(e.target.value === "true")}
            className="w-full bg-white border border-stone-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all"
          >
            <option value="true">Active (Has Access)</option>
            <option value="false">Disabled (No Access)</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
        <button
          type="button"
          disabled={isLoading}
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-stone-600 border border-stone-300 hover:bg-stone-100 transition disabled:bg-stone-400 disabled:text-white disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 rounded-lg bg-amber-700 text-white hover:bg-amber-800 transition font-bold shadow-md active:scale-95 disabled:bg-stone-400 flex items-center justify-center gap-2 min-w-35"
        >
          {isLoading ? (
            <>
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
              </span>
              <span>{initial?.uuid ? "Updating..." : "Creating..."}</span>
            </>
          ) : (
            <span>{initial?.uuid ? "Update Account" : "Save Account"}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default AdminUserForm;
