import slug from "limax";

export function createFromLabel(prefix, label) {
  return `${prefix}/${slug(label, { maintainCase: false })}`;
}
