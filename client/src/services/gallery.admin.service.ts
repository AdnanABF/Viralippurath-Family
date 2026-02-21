import api from "./api";
import type {
  AdminGalleryItem,
  AdminGalleryDraft,
  GalleryQueryParams,
  PaginatedGallery,
} from "../types/gallery.admin";
import { cloudinaryUploadService } from "./cloudinary.service";

/**
 * Service handling Admin-only Gallery operations.
 * Orchestrates compression, cloud upload, and database persistence.
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
   * Orchestration: Compress & Upload -> Strip File -> Save to DB.
   */
  async create(payload: AdminGalleryDraft): Promise<AdminGalleryItem> {
    if (!payload.file) {
      throw new Error("An image file is required to create a gallery item.");
    }

    // 1. Upload to Cloudinary
    const uploadResult = await cloudinaryUploadService.uploadFile(
      payload.file,
      "gallery",
      { compress: true, maxSizeMB: 4 },
    );

    // 2. Prepare final JSON payload
    // We explicitly destructure to remove the 'file' property
    const { file: _, ...dataToSave } = payload;

    const finalPayload = {
      ...dataToSave,
      imageUrl: uploadResult.url,
      cloudinaryPublicId: uploadResult.publicId,
    };

    // 3. Save to database
    return await api.post("/gallery", finalPayload);
  },

  /**
   * Updates an existing gallery item.
   * Logic: If a new file is provided, upload it first, then update metadata.
   */
  async update(
    uuid: string,
    gallery: Partial<AdminGalleryDraft> & { uuid?: string },
  ): Promise<AdminGalleryItem> {
    let finalPayload: any = { ...gallery };

    // 1. If a new file is provided, handle cloud upload
    if (gallery.file) {
      const uploadResult = await cloudinaryUploadService.uploadFile(
        gallery.file,
        "gallery",
        { compress: true, maxSizeMB: 4 },
      );
      finalPayload.imageUrl = uploadResult.url;
      finalPayload.cloudinaryPublicId = uploadResult.publicId;
    }

    // 2. Clean up keys to prevent backend validation errors
    const { uuid: _, file: __, ...cleanPayload } = finalPayload;

    // 3. Send update to backend
    return await api.patch(`/gallery/${uuid}`, cleanPayload);
  },

  /**
   * Removes a gallery item and its associated image from Cloudinary via backend
   */
  async remove(uuid: string): Promise<void> {
    await api.delete(`/gallery/${uuid}`);
  },
};
