import slug from "limax";

export function createTagIdFromLabel(prefix, label) {
  return `${prefix}/${slug(label, { maintainCase: false })}`;
}

export function createTagId(/* arguments */) {
  return Array.from(arguments).join("/");
}
