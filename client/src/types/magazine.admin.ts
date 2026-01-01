import type { PublicMagazine } from "./magazine.public";

export type MagazineStatus = "DRAFT" | "PUBLISHED";

export type AdminMagazine = PublicMagazine & {
  status: MagazineStatus;
};

export type AdminMagazineDraft = Omit<AdminMagazine, "id">;
