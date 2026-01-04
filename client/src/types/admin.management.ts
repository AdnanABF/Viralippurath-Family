export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "MEMBER";

export interface AdminUser {
  uuid: string;
  username: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  lastLogin?: string; // Date string from backend
  createdAt: string;
  updatedAt: string;
}

// For creating a new admin (includes password)
export interface AdminUserDraft {
  username: string;
  fullName: string;
  password: string;
  role: AdminRole;
  isActive: boolean;
}

// For updates (all optional, includes optional password)
export interface AdminUserUpdate extends Partial<AdminUserDraft> {
  uuid: string;
}
