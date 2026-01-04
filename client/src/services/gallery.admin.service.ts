import api from "./api";
import type { AdminGalleryItem } from "../types/gallery.admin";

export const galleryAdminService = {
  /**
   * Fetches all gallery items for the admin view
   */
  async getAll(): Promise<AdminGalleryItem[]> {
    const { data } = await api.get("/gallery/admin");
    return data;
  },

  /**
   * Creates a new gallery item.
   * @param formData - Contains 'image' (File) and text fields (caption, album, etc.)
   */
  async create(formData: FormData): Promise<AdminGalleryItem> {
    const { data } = await api.post("/gallery", formData);
    return data;
  },

  /**
   * Updates an existing gallery item.
   * @param uuid - The unique identifier of the item
   * @param formData - Contains updated text fields and optional 'image' File
   */
  async update(uuid: string, formData: FormData): Promise<AdminGalleryItem> {
    // We pass the formData directly. Axios handles the headers.
    const { data } = await api.patch(`/gallery/${uuid}`, formData);
    return data;
  },

  /**
   * Removes a gallery item and its associated image from Cloudinary
   */
  async remove(uuid: string): Promise<void> {
    await api.delete(`/gallery/${uuid}`);
  },
};
