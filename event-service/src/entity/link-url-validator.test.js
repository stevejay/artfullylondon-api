import linkUrlValidator from "./link-url-validator";
import * as linkType from "../types/link-type";

test.each([
  ["http://foo", linkType.WIKIPEDIA, false],
  ["https://en.wikipedia.org/Rabbit", linkType.WIKIPEDIA, true],
  ["https://en.wikipedia.org/Rabbit?foo=bar", linkType.WIKIPEDIA, false],
  ["http://foo", linkType.FACEBOOK, false],
  ["https://www.facebook.com/Rabbit", linkType.FACEBOOK, true],
  ["https://www.facebook.com/Rabbit?foo=bar", linkType.FACEBOOK, false],
  ["http://foo", linkType.TWITTER, false],
  ["https://twitter.com/Rabbit", linkType.TWITTER, true],
  ["https://twitter.com/Rabbit?foo=bar", linkType.TWITTER, false],
  ["http://foo", linkType.INSTAGRAM, false],
  ["https://www.instagram.com/Rabbit", linkType.INSTAGRAM, true],
  ["https://www.instagram.com/Rabbit?foo=bar", linkType.INSTAGRAM, false],
  ["https://foo", linkType.HOMEPAGE, true]
])(
  "should return %s when validating url %s as a %s link",
  (url, link, expected) => {
    const result = linkUrlValidator(url, link);
    expect(result).toEqual(expected);
  }
);
