import format from "date-fns/format";

export function getUtcNow() {
  return new Date(Date.now());
}

export function formatAsISODateString(date) {
  return format(date, "yyyy-MM-dd");
}
