import normalise from "normalise-request";
import sanitize from "sanitize-html";

const SANITIZE_OPTIONS = {
  allowedTags: ["p", "b", "i", "em", "strong", "a"],
  allowedAttributes: { a: ["href"] }
};

normalise.normalisers.sanitizeHtml = param => {
  return typeof param === "string" ? sanitize(param, SANITIZE_OPTIONS) : param;
};

export default normalise;
