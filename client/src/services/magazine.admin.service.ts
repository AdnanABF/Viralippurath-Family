import api from "./api";
import type {
  AdminMagazine,
  AdminMagazineDraft,
  MagazineQueryParams,
  PaginatedMagazines,
} from "../types/magazine.admin";

/**
 * Service handling Admin-only Magazine operations.
 * api.ts now automatically unwraps 'response.data.data' and handles success toasts.
 */
export const magazineAdminService = {
  /**
   * Fetches magazines for the admin view with filters and pagination
   */
  async getAll(params?: MagazineQueryParams): Promise<PaginatedMagazines> {
    return await api.get("/magazine/admin", { params });
  },

  /**
   * Creates a new magazine entry
   */
  async create(payload: AdminMagazineDraft): Promise<AdminMagazine> {
    return await api.post("/magazine", payload);
  },

  /**
   * Updates an existing magazine entry
   */
  async update(
    uuid: string,
    magazine: Partial<AdminMagazineDraft> & { uuid?: string }
  ): Promise<AdminMagazine> {
    // Clean up internal keys if they exist to prevent backend validation errors
    const { uuid: _, file: __, ...cleanPayload } = magazine;

    return await api.patch(`/magazine/${uuid}`, cleanPayload);
  },

  /**
   * Removes a magazine and its PDF from Cloudinary
   */
  async remove(uuid: string): Promise<void> {
    await api.delete(`/magazine/${uuid}`);
  },
};
