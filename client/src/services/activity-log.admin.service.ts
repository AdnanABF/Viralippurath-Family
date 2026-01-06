import api from "./api"; // Adjust path based on your structure
import type { ActivityLog } from "../types/activity-log.admin";

export const activityAdminService = {
  /**
   * Fetches the complete list of activity logs for the admin audit trail.
   */
  getAll: async (): Promise<ActivityLog[]> => {
    const response = await api.get<ActivityLog[]>("/admin/activities");
    return response.data;
  },

  /**
   * Fetches only the most recent logs (for the Dashboard overview).
   * @param limit Number of logs to return
   */
  getRecent: async (limit: number = 5): Promise<ActivityLog[]> => {
    const { data } = await api.get<ActivityLog[]>(
      `/admin/activities?limit=${limit}`
    );
    return data;
  },
};
