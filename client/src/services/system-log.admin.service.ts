import api from "./api";
import type {
  PaginatedSystemLogResponse,
  SystemLogQueryParams,
} from "../types/system-log.admin";

/**
 * Service for monitoring system errors and server-side crashes.
 */
export const systemLogAdminService = {
  /**
   * Fetches paginated system logs with technical filters (error code, method, etc.)
   */
  async getAll(
    params?: SystemLogQueryParams
  ): Promise<PaginatedSystemLogResponse> {
    // Note: This points to your NestJS 'system-log' controller
    return (await api.get<PaginatedSystemLogResponse>("admin/system-logs", {
      params,
    })) as any;
  },

  /**
   * Triggers a cleanup of logs older than 30 days.
   */
  async cleanup(): Promise<{ message: string; deletedCount: number }> {
    return await api.delete("admin/system-logs/cleanup");
  },
};
