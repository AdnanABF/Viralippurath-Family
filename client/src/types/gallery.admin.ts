import type { PublicGalleryItem } from "./gallery.public";

export type GalleryStatus = "DRAFT" | "PUBLISHED";

export type AdminGalleryItem = PublicGalleryItem & {
  status: GalleryStatus;
  cloudinaryPublicId: string;
};

export type AdminGalleryDraft = {
  caption: string;
  album: string;
  year: number;
  status: GalleryStatus;
  file?: File; // Temporary for form handling
  imageUrl?: string;
  cloudinaryPublicId?: string;
};

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
