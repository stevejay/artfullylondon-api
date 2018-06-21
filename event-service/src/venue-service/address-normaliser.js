const WINDOWS_NEWLINE_REGEX = /\r\n/g;
const LINE_OF_ADDRESS_REGEX = /^\s*(.+?)\s*(?:,+)?\s*$/;

export default function(param) {
  if (typeof param !== "string") {
    return param;
  }

  param = param.replace(WINDOWS_NEWLINE_REGEX, "\n");

  const linesOfAddress = param
    .split("\n")
    .map(lineOfAddress => {
      const matches = lineOfAddress.match(LINE_OF_ADDRESS_REGEX);
      return matches ? matches[1].trim() : "";
    })
    .filter(lineOfAddress => lineOfAddress.length > 0);

  return linesOfAddress.join("\n");
}
