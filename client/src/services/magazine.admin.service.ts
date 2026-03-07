import api from "./api";
import type {
  AdminMagazine,
  AdminMagazineDraft,
  MagazineQueryParams,
  PaginatedMagazines,
} from "../types/magazine.admin";
import { cloudinaryUploadService } from "./cloudinary.service";

/**
 * Service handling Admin-only Magazine operations.
 * Orchestrates file uploads and database persistence.
 */
export const magazineAdminService = {
  /**
   * Fetches magazines for the admin view with filters and pagination
   */
  async getAll(params?: MagazineQueryParams): Promise<PaginatedMagazines> {
    return await api.get("/magazine/admin", { params });
  },

  /**
   * Creates a new magazine entry.
   * Orchestration: Upload PDF/Image to Cloudinary -> Strip File -> Save to DB.
   */
  async create(payload: AdminMagazineDraft): Promise<AdminMagazine> {
    let finalPayload: any = { ...payload };

    // 1. If a file is present, upload it first
    if (payload.file) {
      const uploadResult = await cloudinaryUploadService.uploadFile(
        payload.file,
        "magazines",
      );
      finalPayload.pdfUrl = uploadResult.url;
      finalPayload.cloudinaryPublicId = uploadResult.publicId;
    }

    // 2. Strip the 'file' property to prevent NestJS validation errors
    const { file: _, ...dataToSave } = finalPayload;

    // 3. Save to database
    return await api.post("/magazine", dataToSave);
  },

  /**
   * Updates an existing magazine entry.
   */
  async update(
    uuid: string,
    magazine: Partial<AdminMagazineDraft> & { uuid?: string },
  ): Promise<AdminMagazine> {
    let finalPayload: any = { ...magazine };

    // 1. Handle new file upload if provided
    if (magazine.file) {
      const uploadResult = await cloudinaryUploadService.uploadFile(
        magazine.file,
        "magazines",
      );
      finalPayload.pdfUrl = uploadResult.url;
      finalPayload.cloudinaryPublicId = uploadResult.publicId;
    }

    // 2. Clean up keys (uuid and file) to prevent backend validation errors
    const { uuid: _, file: __, ...cleanPayload } = finalPayload;

    return await api.patch(`/magazine/${uuid}`, cleanPayload);
  },

  /**
   * Removes a magazine and its associated files via the backend
   */
  async remove(uuid: string): Promise<void> {
    await api.delete(`/magazine/${uuid}`);
  },
};
