import api from "./api";
import type {
  ActivityLog,
  PaginatedActivityResponse,
} from "../types/activity-log.admin";

export const activityAdminService = {
  /**
   * Fetches paginated activity logs with optional filtering.
   */
  getAll: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    action?: string;
  }): Promise<PaginatedActivityResponse> => {
    const response = await api.get<PaginatedActivityResponse>(
      "/admin/activities",
      {
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          type: params?.type !== "ALL" ? params?.type : undefined,
          action: params?.action !== "ALL" ? params?.action : undefined,
        },
      }
    );
    return response.data;
  },

  /**
   * Fetches only the most recent logs using the dedicated lightweight endpoint.
   */
  getRecent: async (limit: number = 5): Promise<ActivityLog[]> => {
    const { data } = await api.get<ActivityLog[]>(`/admin/activities/recent`, {
      params: { limit },
    });
    return data;
  },
};
