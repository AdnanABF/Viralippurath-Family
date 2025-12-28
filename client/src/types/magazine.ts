export type MagazineIssue = {
  id: string;
  title: string;
  year: string;
  thumbnail: string;
  downloadUrl: string;
  viewerUrl?: string; // for future flipbook embed
};
