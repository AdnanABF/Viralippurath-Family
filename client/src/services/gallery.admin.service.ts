import api from "./api";
import type {
  AdminGalleryItem,
  AdminGalleryDraft,
} from "../types/gallery.admin";

export const galleryAdminService = {
  async getAll(): Promise<AdminGalleryItem[]> {
    const { data } = await api.get("/gallery/admin");
    return data;
  },

  async create(payload: AdminGalleryDraft): Promise<AdminGalleryItem> {
    const { data } = await api.post("/gallery", payload);
    return data;
  },

  async update(
    uuid: string,
    item: Partial<AdminGalleryItem>
  ): Promise<AdminGalleryItem> {
    const { id: _, uuid: __, ...payload } = item as any;
    const { data } = await api.patch(`/gallery/${uuid}`, payload);
    return data;
  },

  async remove(uuid: string): Promise<void> {
    await api.delete(`/gallery/${uuid}`);
  },
};
