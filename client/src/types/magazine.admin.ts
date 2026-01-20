import type { PublicMagazine } from "./magazine.public";

export type MagazineStatus = "DRAFT" | "PUBLISHED";

export type AdminMagazine = PublicMagazine & {
  status: MagazineStatus;
  cloudinaryPublicId: string;
};

export type AdminMagazineDraft = {
  title_en: string;
  title_ml?: string;
  publishedDate: string;
  status: MagazineStatus;
  file?: File; // Temporary for the form
  pdfUrl?: string;
  cloudinaryPublicId?: string;
};

// Interface for Magazine-specific query filters
export interface MagazineQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

// Interface for the paginated response
export interface PaginatedMagazines {
  data: AdminMagazine[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
