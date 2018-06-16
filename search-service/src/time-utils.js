import format from "date-fns/format";

const DATE_FORMAT = "yyyy-MM-dd";

export function getUtcNow() {
  return new Date(Date.now());
}

export function formatAsISODateString(date) {
  return format(date, DATE_FORMAT);
}
