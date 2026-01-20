import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type {
  AdminUser,
  AdminUserDraft,
  AdminRole,
} from "../../../types/admin.management";

import { PrimaryButton, SecondaryButton } from "../../ui";

interface Props {
  initial?: AdminUser;
  currentUserUuid?: string;
  onSave: (admin: AdminUser | AdminUserDraft) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const AdminUserForm: React.FC<Props> = ({
  initial,
  currentUserUuid,
  onSave,
  onCancel,
  isLoading,
}) => {
  const [username, setUsername] = useState(initial?.username ?? "");
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<AdminRole>(initial?.role ?? "ADMIN");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const isSelf = initial?.uuid === currentUserUuid;

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
            <div className="relative">
              <input
                required={!initial?.uuid}
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-stone-300 px-4 py-3 pr-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base"
                placeholder={initial?.uuid ? "••••••••" : "Min. 8 chars"}
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-stone-400 hover:text-amber-700 transition-colors focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Role + Status Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Role
            </label>
            <select
              disabled={isLoading || isSelf}
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base appearance-none disabled:bg-stone-400 disabled:text-white disabled:opacity-50 disabled:font-bold"
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
              disabled={isLoading || isSelf}
              value={isActive ? "true" : "false"}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full bg-white border border-stone-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600 transition-all text-base appearance-none disabled:bg-stone-400 disabled:text-white disabled:opacity-50 disabled:font-bold"
            >
              <option value="true">Active (Has Access)</option>
              <option value="false">Disabled (No Access)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-stone-200">
        <SecondaryButton
          variant="form"
          onClick={onCancel}
          disabled={isLoading}
          label="Cancel"
        />
        <PrimaryButton
          type="submit"
          variant="form"
          label={initial?.uuid ? "Update Account" : "Save Account"}
          isLoading={isLoading}
          loadingLabel={initial?.uuid ? "Updating..." : "Creating..."}
        />
      </div>
    </form>
  );
};

export default AdminUserForm;
