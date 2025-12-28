import type { Notification } from "../../types/notification";

export const notifications: Notification[] = [
  {
    id: "1",
    title: "Annual Family Meet Announced",
    content:
      "The annual family gathering will be held in January. More details soon.",
    date: "2024-12-20",
    priority: "HIGH",
  },
  {
    id: "2",
    title: "Magazine Submissions Open",
    content:
      "Members are invited to submit articles and photos for the next edition.",
    date: "2024-12-10",
    priority: "NORMAL",
  },
  {
    id: "3",
    title: "Website Launched",
    content: "Welcome to the official Viralippurath family website.",
    date: "2024-12-01",
    priority: "NORMAL",
  },
];
