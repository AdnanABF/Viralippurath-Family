import type { AdminEvent } from "../../../types/event.admin";

export const adminEvents: AdminEvent[] = [{
  id: "1",
  title: "Family Gathering 2024",
  description: "Annual family gathering at the lake house.",
  type: "Gathering",
  date: "2024-08-15",
  status: "PUBLISHED",
  location: "Lake House",
}, {
  id: "2",
  title: "Wedding Ceremony",
  description: "Wedding ceremony of John and Jane.",
  type: "Ceremony",
  date: "2024-09-10",
  status: "DRAFT",
  location: "Central Park",
}
];
