export function formatDateTime(isoDate: string, locale: string = "en-GB") {
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

export function toDateInputValue(isoDate?: string) {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  return date.toISOString().split("T")[0];
}

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
