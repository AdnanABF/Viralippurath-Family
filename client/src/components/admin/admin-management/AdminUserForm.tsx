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
      className="bg-white sm:bg-stone-50 border-x-0 sm:border border-stone-200 sm:rounded-2xl pt-0 p-4 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
    >
      <div className="sticky top-0 bg-white sm:bg-stone-50 pt-4 pb-4 sm:pt-0 z-10 border-b border-stone-100 mb-2">
        <h2 className="text-xl font-serif text-stone-800">
          {initial?.uuid ? "Edit Admin Account" : "Create New Admin"}
        </h2>
      </div>

      <div className="space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Full Name
          </label>
          <input
            required
            disabled={isLoading}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
            placeholder="e.g. John Doe"
          />
        </div>

        {/* Username and Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Username
            </label>
            <input
              required
              disabled={isLoading}
              autoComplete="none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
              placeholder="johndoe"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {initial?.uuid ? "New Password (Optional)" : "Password"}
            </label>
            <input
              required={!initial?.uuid}
              type="password"
              disabled={isLoading}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
              placeholder={initial?.uuid ? "••••••••" : "Min. 8 chars"}
              minLength={8}
            />
          </div>
        </div>

        {/* Role + Status Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Role
            </label>
            <select
              disabled={isLoading}
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base appearance-none"
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="MEMBER">Member</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Account Status
            </label>
            <select
              disabled={isLoading}
              value={isActive ? "true" : "false"}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base appearance-none"
            >
              <option value="true">Active (Has Access)</option>
              <option value="false">Disabled (No Access)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-stone-200">
        <button
          type="button"
          disabled={isLoading}
          onClick={onCancel}
          className="order-2 sm:order-1 px-6 py-3 rounded-xl text-stone-600 border border-stone-300 font-medium active:bg-stone-50
           hover:bg-stone-100 transition disabled:bg-stone-400 disabled:text-white disabled:opacity-50 
           focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="order-1 sm:order-2 px-8 py-3 rounded-xl bg-amber-700 text-white
           hover:bg-amber-800 transition font-bold shadow-lg shadow-amber-900/10 active:scale-[0.98] disabled:bg-stone-400 flex items-center justify-center gap-2
            focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
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
