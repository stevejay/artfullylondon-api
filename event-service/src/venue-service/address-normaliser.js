const WINDOWS_NEWLINE_REGEX = /\r\n/g;
const LINE_OF_ADDRESS_REGEX = /^\s*(.+?)\s*(?:,+)?\s*$/;

export default function(param) {
  if (typeof param !== "string") {
    return param;
  }
  return param
    .replace(WINDOWS_NEWLINE_REGEX, "\n")
    .split("\n")
    .map(lineOfAddress => {
      const matches = lineOfAddress.match(LINE_OF_ADDRESS_REGEX);
      return matches ? matches[1].trim() : "";
    })
    .filter(lineOfAddress => lineOfAddress.length > 0)
    .join("\n");
}
