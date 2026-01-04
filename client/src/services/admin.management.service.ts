import api from "./api";
import type { AdminUser, AdminUserDraft } from "../types/admin.management";

export const adminManagementService = {
  async getAll(): Promise<AdminUser[]> {
    const { data } = await api.get("/admin");
    return data;
  },

  async create(payload: AdminUserDraft): Promise<AdminUser> {
    const { data } = await api.post("/admin", payload);
    return data;
  },

  async update(
    uuid: string,
    payload: Partial<AdminUserDraft>
  ): Promise<AdminUser> {
    const { data } = await api.patch(`/admin/${uuid}`, payload);
    return data;
  },

  async remove(uuid: string): Promise<void> {
    await api.delete(`/admin/${uuid}`);
  },
};
