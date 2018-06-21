import * as linkType from "../types/link-type";

export default function(url, link) {
  switch (link) {
    case linkType.WIKIPEDIA:
      return (
        url.startsWith("https://en.wikipedia.org/") && !hasQueryString(url)
      );
    case linkType.FACEBOOK:
      return (
        url.startsWith("https://www.facebook.com/") && !hasQueryString(url)
      );
    case linkType.TWITTER:
      return url.startsWith("https://twitter.com/") && !hasQueryString(url);
    case linkType.INSTAGRAM:
      return (
        url.startsWith("https://www.instagram.com/") && !hasQueryString(url)
      );
    default:
      return true;
  }
}

function hasQueryString(url) {
  return url.indexOf("?") > -1;
}
