import padstart from "lodash.padstart";

export function formatDate(date) {
  const fullYear = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${fullYear}/${padstart(month, 2, "0")}/${padstart(day, 2, "0")}`;
}
