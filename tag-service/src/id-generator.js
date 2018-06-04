import slug from "limax";

export function join(/* arguments */) {
  return Array.from(arguments).join("/");
}

export function createFromLabel(prefix, label) {
  return `${prefix}/${slug(label, { maintainCase: false })}`;
}
