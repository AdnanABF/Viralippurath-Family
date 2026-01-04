import api from "./api";
import type {
  AdminMagazine,
  AdminMagazineDraft,
} from "../types/magazine.admin";

export const magazineAdminService = {
  async getAll(): Promise<AdminMagazine[]> {
    const { data } = await api.get("/magazine/admin");
    return data;
  },

  async create(payload: AdminMagazineDraft): Promise<AdminMagazine> {
    const { data } = await api.post("/magazine", payload);
    return data;
  },

  async update(
    uuid: string,
    magazine: Partial<AdminMagazine>
  ): Promise<AdminMagazine> {
    const { id: _, _id: __, uuid: ___, ...payload } = magazine as any;

    const { data } = await api.patch(`/magazine/${uuid}`, payload);
    return data;
  },

  async remove(uuid: string): Promise<void> {
    await api.delete(`/magazine/${uuid}`);
  },
};
