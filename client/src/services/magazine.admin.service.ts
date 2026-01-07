import api from "./api";
import type {
  AdminMagazine,
  AdminMagazineDraft,
  MagazineQueryParams,
  PaginatedMagazines,
} from "../types/magazine.admin";

export const magazineAdminService = {
  /**
   * Fetches magazines for the admin view with filters and pagination
   */
  async getAll(params?: MagazineQueryParams): Promise<PaginatedMagazines> {
    const { data } = await api.get("/magazine/admin", { params });
    return data;
  },

  /**
   * Creates a new magazine entry
   */
  async create(payload: AdminMagazineDraft): Promise<AdminMagazine> {
    const { data } = await api.post("/magazine", payload);
    return data;
  },

  /**
   * Updates an existing magazine entry
   */
  async update(
    uuid: string,
    magazine: Partial<AdminMagazineDraft> & { uuid?: string }
  ): Promise<AdminMagazine> {
    // Clean up internal keys if they exist
    const { uuid: _, file: __, ...cleanPayload } = magazine;

    const { data } = await api.patch(`/magazine/${uuid}`, cleanPayload);
    return data;
  },

  /**
   * Removes a magazine and its PDF from Cloudinary
   */
  async remove(uuid: string): Promise<void> {
    await api.delete(`/magazine/${uuid}`);
  },
};
