import slug from "limax";

const SLUG_OPTIONS = {
  maintainCase: false
};

export function createTagId(tagType, label) {
  return `${slug(tagType, SLUG_OPTIONS)}/${slug(label, SLUG_OPTIONS)}`;
}
