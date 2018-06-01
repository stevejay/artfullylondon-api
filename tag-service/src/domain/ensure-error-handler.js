export default function(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}
