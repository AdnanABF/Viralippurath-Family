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
    // We send the JSON payload directly.
    // The 'file' property was already removed in the handleSave logic.
    const { data } = await api.post("/magazine", payload);
    return data;
  },

  async update(
    uuid: string,
    magazine: Partial<AdminMagazineDraft> & { uuid?: string }
  ): Promise<AdminMagazine> {
    // Clean up internal keys if they exist
    const { uuid: _, file: __, ...cleanPayload } = magazine;

    const { data } = await api.patch(`/magazine/${uuid}`, cleanPayload);
    return data;
  },

  async remove(uuid: string): Promise<void> {
    await api.delete(`/magazine/${uuid}`);
  },
};
