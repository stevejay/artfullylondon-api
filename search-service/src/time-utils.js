import format from "date-fns/format";

export function getUtcNow() {
  return new Date(Date.now());
}

export function formatAsIsoShortDateString(date) {
  return format(date, "yyyy-MM-dd");
}
