import api from "./api";
import type {
  AdminQueryParams,
  AdminUser,
  AdminUserDraft,
  PaginatedAdmins,
} from "../types/admin.management";

/**
 * Service handling system admin user management.
 * api.ts now automatically unwraps 'response.data.data'.
 */
export const adminManagementService = {
  async getAll(params?: AdminQueryParams): Promise<PaginatedAdmins> {
    return await api.get("/admin", { params });
  },

  async create(payload: AdminUserDraft): Promise<AdminUser> {
    return (await api.post<AdminUser>("/admin", payload)) as any;
  },

  async update(
    uuid: string,
    payload: Partial<AdminUserDraft>
  ): Promise<AdminUser> {
    return (await api.patch<AdminUser>(`/admin/${uuid}`, payload)) as any;
  },

  async remove(uuid: string): Promise<void> {
    await api.delete(`/admin/${uuid}`);
  },
};
