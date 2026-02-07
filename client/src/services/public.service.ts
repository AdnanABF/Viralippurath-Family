import api from "./api";
import type { PublicEvent } from "../types/event.public";
import type { PublicGalleryItem } from "../types/gallery.public";
import type { PublicMagazine } from "../types/magazine.public";
import type { PublicNotification } from "../types/notification.public";

// Interface for the paginated response structure
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    typeCounts?: Record<string, number>;
    totalInView?: number;
  };
}

export const publicService = {
  getEvents: async (params: {
    timeline: "upcoming" | "past" | "ongoing";
    type?: string;
    page?: number;
    limit?: number;
  }) => {
    const { timeline, type, page, limit } = params;
    const queryParams = new URLSearchParams({ timeline });

    if (type && type !== "ALL") queryParams.append("type", type);
    if (page) queryParams.append("page", page.toString());
    if (limit) queryParams.append("limit", limit.toString());

    return (await api.get<PaginatedResponse<PublicEvent>>(
      `/events/published?${queryParams.toString()}`,
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
      "/notifications/latest",
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
