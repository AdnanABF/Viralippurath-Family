export interface StatValue {
  current: number;
  diff: number;
}

export interface DashboardStats {
  upcomingEvents: StatValue;
  galleryPhotos: StatValue;
  totalMagazines: StatValue;
  activeAlerts: StatValue;
}
