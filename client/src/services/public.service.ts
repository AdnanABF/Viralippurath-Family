import api from "./api";
import type { PublicEvent } from "../types/event.public";
import type { PublicGalleryItem } from "../types/gallery.public";
import type { PublicMagazine } from "../types/magazine.public";
import type { PublicNotification } from "../types/notification.public";

export const publicService = {
  getEvents: async (type: "upcoming" | "past" | "ongoing") => {
    return (await api.get<PublicEvent[]>(
      `/events/published?type=${type}`
    )) as any;
  },

  getGallery: async () => {
    return (await api.get<PublicGalleryItem[]>("/gallery/published")) as any;
  },

  getMagazines: async () => {
    return (await api.get<PublicMagazine[]>("/magazine/published")) as any;
  },

  getLatestNotifications: async () => {
    return (await api.get<PublicNotification[]>(
      "/notifications/latest"
    )) as any;
  },

  getNotifications: async (params?: {
    category?: string;
    archived?: boolean;
  }) => {
    const queryParams = new URLSearchParams();

    if (params?.category && params.category !== "ALL") {
      queryParams.append("category", params.category);
    }

    if (params?.archived !== undefined) {
      queryParams.append("archived", params.archived.toString());
    }

    const queryString = queryParams.toString();
    const url = `/notifications/published${
      queryString ? `?${queryString}` : ""
    }`;

    return (await api.get<PublicNotification[]>(url)) as any;
  },
};
