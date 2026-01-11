import api from "./api";
import type { DashboardStats } from "../types/dashboard.admin";

/**
 * Service for fetching administrative overview data.
 */
export const dashboardAdminService = {
  /**
   * Fetches the counts for the dashboard cards.
   * api.ts automatically unwraps 'response.data.data'.
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    return (await api.get<DashboardStats>("/admin/dashboard/stats")) as any;
  },
};
