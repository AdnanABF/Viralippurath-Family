export interface ActivityLog {
  uuid: string;
  adminUserName: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entityType: "EVENT" | "MAGAZINE" | "NOTIFICATION" | "GALLERY" | "ADMIN";
  entityTitle: string;
  createdAt: string;
}
