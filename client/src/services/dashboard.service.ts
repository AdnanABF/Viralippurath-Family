import api from "./api";

export interface DashboardStats {
  upcomingEvents: number;
  galleryPhotos: number;
  totalMagazines: number;
  activeAlerts: number;
}

export interface ActivityLog {
  uuid: string;
  adminUserName: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  entityType: "EVENT" | "MAGAZINE" | "NOTIFICATION" | "GALLERY" | "ADMIN";
  entityTitle: string;
  createdAt: string;
}

/**
 * Fetches the counts for the dashboard cards
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get<DashboardStats>("/admin/dashboard/stats");
  return data;
};

/**
 * Fetches the recent activities list
 */
export const getRecentActivities = async (
  limit: number = 10
): Promise<ActivityLog[]> => {
  const { data } = await api.get<ActivityLog[]>(
    `/admin/activities?limit=${limit}`
  );
  return data;
};
