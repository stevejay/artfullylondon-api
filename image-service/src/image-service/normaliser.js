import normalise from "normalise-request";

const normaliser = {
  id: {
    replace: { pattern: /-/g, newSubStr: "" }
  }
};

export function normaliseAddImageRequest(request) {
  return normalise({ ...request }, normaliser);
}
