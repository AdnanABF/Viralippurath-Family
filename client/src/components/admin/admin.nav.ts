import {
  LayoutDashboard,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  Users,
  Bell,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  roles?: string[];
}

export const adminNav: NavItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Events",
    path: "/admin/events",
    icon: Calendar,
  },
  {
    label: "Gallery",
    path: "/admin/gallery",
    icon: ImageIcon,
  },
  {
    label: "Magazine",
    path: "/admin/magazine",
    icon: BookOpen,
  },
  {
    label: "Notifications",
    path: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Manage Admins",
    path: "/admin/manage-admins",
    icon: Users,
    roles: ["SUPER_ADMIN"],
  },
];
