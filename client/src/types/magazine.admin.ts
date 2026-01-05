import type { PublicMagazine } from "./magazine.public";

export type MagazineStatus = "DRAFT" | "PUBLISHED";

export type AdminMagazine = PublicMagazine & {
  status: MagazineStatus;
};

export type AdminMagazineDraft = {
  title: string;
  publishedDate: string;
  status: MagazineStatus;
  file?: File;
};
