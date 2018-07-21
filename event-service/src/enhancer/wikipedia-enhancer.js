import _ from "lodash";
import * as linkType from "../types/link-type";

export function createWikipediaUrl(entity) {
  if (entity.description) {
    return null;
  }

  const wikipediaLink = getLinkByType(entity.links, linkType.WIKIPEDIA);
  if (!wikipediaLink) {
    // no wikipedia link given
    return null;
  }

  const lastSlashIndex = wikipediaLink.url.lastIndexOf("/");
  if (lastSlashIndex === -1 || lastSlashIndex >= wikipediaLink.url.length - 1) {
    // no final component in url
    return null;
  }

  const title = wikipediaLink.url.substring(lastSlashIndex + 1);
  return `https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${title}&exchars=1200`;
}

export function parseWikipediaResponse(response) {
  const pages = _.get(response, "query.pages");
  if (_.isEmpty(pages)) {
    return null;
  }

  const keys = Object.keys(pages);
  if (keys.length !== 1) {
    return null;
  }

  let extract = pages[keys[0]].extract || "";
  const index = extract.indexOf("\n");

  if (index !== -1) {
    extract = extract.substring(0, index);
  }

  extract = extract.replace(/\.\.\.\.?$/, ".");

  return {
    description: extract.length > 10 ? "<p>" + extract + "</p>" : null,
    descriptionCredit: "Wikipedia"
  };
}

function getLinkByType(links, linkType) {
  const matches = (links || []).filter(link => link.type === linkType);
  return matches.length ? matches[0] : null;
}
