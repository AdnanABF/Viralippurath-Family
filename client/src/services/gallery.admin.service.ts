import api from "./api";
import type {
  AdminGalleryItem,
  GalleryQueryParams,
  PaginatedGallery,
} from "../types/gallery.admin";

/**
 * Service handling Admin-only Gallery operations.
 * api.ts now automatically unwraps 'response.data.data' and handles success toasts.
 */
export const galleryAdminService = {
  /**
   * Fetches gallery items for the admin view with filters and pagination
   */
  async getAll(params?: GalleryQueryParams): Promise<PaginatedGallery> {
    return await api.get("/gallery/admin", { params });
  },

  /**
   * Creates a new gallery item.
   * @param formData - Contains 'image' (File) and text fields (caption, album, etc.)
   */
  async create(formData: FormData): Promise<AdminGalleryItem> {
    return await api.post("/gallery", formData);
  },

  /**
   * Updates an existing gallery item.
   * @param uuid - The unique identifier of the item
   * @param formData - Contains updated text fields and optional 'image' File
   */
  async update(uuid: string, formData: FormData): Promise<AdminGalleryItem> {
    return await api.patch(`/gallery/${uuid}`, formData);
  },

  /**
   * Removes a gallery item and its associated image from Cloudinary
   */
  async remove(uuid: string): Promise<void> {
    await api.delete(`/gallery/${uuid}`);
  },
};
