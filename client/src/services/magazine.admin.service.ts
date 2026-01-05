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
    const formData = new FormData();

    // 1. Append the text fields
    formData.append("title", payload.title);
    formData.append("publishedDate", payload.publishedDate);
    formData.append("status", payload.status);

    // 2. Append the file (field name must be 'file' to match the Controller)
    if (payload.file) {
      formData.append("file", payload.file);
    }

    const { data } = await api.post("/magazine", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async update(
    uuid: string,
    magazine: Partial<AdminMagazine> & { file?: File }
  ): Promise<AdminMagazine> {
    const formData = new FormData();

    // 1. Extract and append fields, excluding internal IDs
    const { id, _id, uuid: _, pdfUrl, ...rest } = magazine as any;

    Object.keys(rest).forEach((key) => {
      if (rest[key] !== undefined && rest[key] !== null) {
        formData.append(key, rest[key]);
      }
    });

    // 2. Append the new file if it exists
    if (magazine.file) {
      formData.append("file", magazine.file);
    }

    const { data } = await api.patch(`/magazine/${uuid}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },

  async remove(uuid: string): Promise<void> {
    await api.delete(`/magazine/${uuid}`);
  },
};
