import type { PublicMagazine } from "./magazine.public";

export type MagazineStatus = "DRAFT" | "PUBLISHED";

export type AdminMagazine = PublicMagazine & {
  status: MagazineStatus;
  cloudinaryPublicId: string;
};

export type AdminMagazineDraft = {
  title: string;
  publishedDate: string;
  status: MagazineStatus;
  file?: File; // Temporary for the form
  pdfUrl?: string;
  cloudinaryPublicId?: string;
};
