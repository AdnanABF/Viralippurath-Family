import api from "./api";
import type { DashboardStats } from "../types/dashboard.admin";

export const dashboardAdminService = {
  /**
   * Fetches the counts for the dashboard cards
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    const { data } = await api.get<DashboardStats>("/admin/dashboard/stats");
    return data;
  },
};
