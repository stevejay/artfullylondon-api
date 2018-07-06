import normalise from "normalise-request";

const normaliser = {
  label: {
    trim: true,
    toLowerCase: true,
    collapseWhitespace: true
  }
};

export function normaliseCreateTagRequest(request) {
  return normalise({ ...request }, normaliser);
}
