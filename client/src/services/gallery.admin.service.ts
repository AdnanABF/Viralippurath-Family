import api from "./api";
import type {
  AdminGalleryItem,
  AdminGalleryDraft,
} from "../types/gallery.admin";

const normalize = (item: any): AdminGalleryItem => ({
  ...item,
  id: item.id || item._id,
});

export const galleryAdminService = {
  async getAll(): Promise<AdminGalleryItem[]> {
    const { data } = await api.get("/gallery/admin");
    return data.map(normalize);
  },

  async create(payload: AdminGalleryDraft): Promise<AdminGalleryItem> {
    const { data } = await api.post("/gallery", payload);
    return normalize(data);
  },

  async update(id: string, payload: Partial<AdminGalleryDraft>) {
    const { data } = await api.patch(`/gallery/${id}`, payload);
    return normalize(data);
  },

  async remove(id: string) {
    await api.delete(`/gallery/${id}`);
  },
};
