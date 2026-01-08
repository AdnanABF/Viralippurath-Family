import type { PublicGalleryItem } from "./gallery.public";

export type GalleryStatus = "DRAFT" | "PUBLISHED";

export type AdminGalleryItem = PublicGalleryItem & {
  status: GalleryStatus;
};

export type AdminGalleryDraft = Omit<AdminGalleryItem, "uuid">;

export interface GalleryQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  album?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedGallery {
  data: AdminGalleryItem[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
