/**
 * Formats a date (e.g., "January 3, 2026")
 * Automatically localizes based on the user's browser timezone.
 */
export function formatDate(isoDate: string) {
  if (!isoDate) return "";
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats a date (e.g., "20/01/2026, 3:38 PM")
 * Uses en-GB for DD/MM/YYYY format but respects browser timezone.
 */
export function formatDateTime(isoDate: string, locale: string = "en-GB") {
  if (!isoDate) return "";
  const date = new Date(isoDate);

  const formatted = date.toLocaleString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formatted.replace(/\b(am|pm)\b/i, (m) => m.toUpperCase());
}

/**
 * Formats a date (e.g., "Jan 20, 2026 at 4:30 PM")
 */
export const formatFullDate = (dateInput: string | Date): string => {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

/**
 * Converts a date string or object into a relative time string
 * (e.g., "5 minutes ago", "Yesterday")
 */
export const formatRelativeTime = (dateInput: string | Date): string => {
  if (!dateInput) return "";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 5) return "Just now";

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return date.toLocaleDateString();
};

/**
 * Returns YYYY-MM-DD for <input type="date">
 */
export function toDateInputValue(isoDate?: string) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  // We use local getters so the input shows what the user expects in their timezone
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Returns YYYY-MM-DDTHH:mm for <input type="datetime-local">
 * Crucial: It shows the LOCAL time to the admin.
 */
export function toDateTimeInputValue(isoDate?: string) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}T` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}`
  );
}

/**
 * Returns current local time in YYYY-MM-DDTHH:mm format for new entries
 */
export function nowDateTimeInputValue() {
  const date = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    `${date.getFullYear()}-` +
    `${pad(date.getMonth() + 1)}-` +
    `${pad(date.getDate())}T` +
    `${pad(date.getHours())}:` +
    `${pad(date.getMinutes())}`
  );
}

/**
 * NEW: Converts the string from <input type="datetime-local"> to a UTC ISO string.
 * Use this in your "handleSubmit" before sending to the backend.
 */
export function toUTCISO(localDateTimeValue: string): string {
  if (!localDateTimeValue) return "";
  return new Date(localDateTimeValue).toISOString();
}
