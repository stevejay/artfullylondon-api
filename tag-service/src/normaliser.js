import normalise from "normalise-request";

const normaliser = {
  type: {
    trim: true,
    toLowerCase: true
  },
  label: {
    trim: true,
    toLowerCase: true,
    collapseWhitespace: true
  }
};

export function normaliseCreateTagRequest(request) {
  return normalise({ ...request }, normaliser);
}
