import type { PublicGalleryItem } from "./gallery.public";

export type GalleryStatus = "DRAFT" | "PUBLISHED";

export type AdminGalleryItem = PublicGalleryItem & {
  status: GalleryStatus;
};

export type AdminGalleryDraft = Omit<AdminGalleryItem, "uuid">;
