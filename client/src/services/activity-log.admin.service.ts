import api from "./api";
import type {
  ActivityLog,
  PaginatedActivityResponse,
  ActivityLogQueryParams,
} from "../types/activity-log.admin";

/**
 * Service for auditing administrative actions across the portal.
 * api.ts automatically unwraps 'response.data.data'.
 */
export const activityAdminService = {
  /**
   * Fetches paginated activity logs with optional filtering.
   */
  async getAll(
    params?: ActivityLogQueryParams
  ): Promise<PaginatedActivityResponse> {
    return (await api.get<PaginatedActivityResponse>("/admin/activities", {
      params,
    })) as any;
  },

  /**
   * Fetches only the most recent logs using the dedicated lightweight endpoint.
   * Useful for the Dashboard 'Recent Activity' widget.
   */
  async getRecent(limit: number = 5): Promise<ActivityLog[]> {
    return (await api.get<ActivityLog[]>(`/admin/activities/recent`, {
      params: { limit },
    })) as any;
  },
};
