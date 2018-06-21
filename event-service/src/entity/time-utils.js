import format from "date-fns/format";

function getUtcNow() {
  return new Date(Date.now());
}

function formatAsISODateString(date) {
  return format(date, "yyyy-MM-dd");
}

export function getCreatedDateForDB() {
  return formatAsISODateString(getUtcNow());
}
