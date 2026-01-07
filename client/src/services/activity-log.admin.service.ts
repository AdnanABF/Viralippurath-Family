import api from "./api";
import type {
  ActivityLog,
  PaginatedActivityResponse,
  ActivityLogQueryParams,
} from "../types/activity-log.admin";

export const activityAdminService = {
  /**
   * Fetches paginated activity logs with optional filtering.
   */
  async getAll(
    params?: ActivityLogQueryParams
  ): Promise<PaginatedActivityResponse> {
    const { data } = await api.get<PaginatedActivityResponse>(
      "/admin/activities",
      { params }
    );
    return data;
  },

  /**
   * Fetches only the most recent logs using the dedicated lightweight endpoint.
   */
  async getRecent(limit: number = 5): Promise<ActivityLog[]> {
    const { data } = await api.get<ActivityLog[]>(`/admin/activities/recent`, {
      params: { limit },
    });
    return data;
  },
};
