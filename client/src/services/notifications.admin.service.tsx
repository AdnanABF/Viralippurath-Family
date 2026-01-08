import api from "./api";
import type {
  AdminNotification,
  AdminNotificationDraft,
  NotificationQueryParams,
  PaginatedNotifications,
} from "../types/notification.admin";

/**
 * Service handling Admin-only Notification operations.
 * api.ts now automatically unwraps 'response.data.data' and handles success toasts.
 */
export const notificationsAdminService = {
  async getAll(
    params?: NotificationQueryParams
  ): Promise<PaginatedNotifications> {
    return (await api.get<PaginatedNotifications>("/notifications/admin", {
      params,
    })) as any;
  },

  async create(payload: AdminNotificationDraft): Promise<AdminNotification> {
    return (await api.post<AdminNotification>(
      "/notifications",
      payload
    )) as any;
  },

  async update(
    uuid: string,
    notification: Partial<AdminNotification>
  ): Promise<AdminNotification> {
    // Strip out internal ID/UUID to avoid backend validation errors
    const { id: _, uuid: __, ...payload } = notification as any;

    return (await api.patch<AdminNotification>(
      `/notifications/${uuid}`,
      payload
    )) as any;
  },

  async remove(uuid: string): Promise<void> {
    await api.delete(`/notifications/${uuid}`);
  },
};
