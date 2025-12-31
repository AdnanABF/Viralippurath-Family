import api from "./api";
import type {
  AdminMagazine,
  AdminMagazineDraft,
} from "../types/magazine.admin";

const normalize = (m: any): AdminMagazine => ({
  ...m,
  id: m.id || m._id,
});

export const magazineAdminService = {
  async getAll(): Promise<AdminMagazine[]> {
    const { data } = await api.get("/magazine/admin");
    return data.map(normalize);
  },

  async create(payload: AdminMagazineDraft): Promise<AdminMagazine> {
    const { data } = await api.post("/magazine", payload);
    return normalize(data);
  },

  async update(
    id: string,
    payload: Partial<AdminMagazineDraft>
  ): Promise<AdminMagazine> {
    const { data } = await api.patch(`/magazine/${id}`, payload);
    return normalize(data);
  },

  async remove(id: string): Promise<void> {
    await api.delete(`/magazine/${id}`);
  },
};
