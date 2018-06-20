import * as request from "request-promise-native";
import * as linkType from "../types/link-type";
import * as xrayWrapper from "./xray-wrapper";

export async function getDescription(params) {
  if (params.description) {
    // don't replace an existing description
    return null;
  }

  const wikipediaLink = getLinkByType(params.links, linkType.WIKIPEDIA);

  if (!wikipediaLink) {
    // no wikipedia link given
    return null;
  }

  const lastSlashIndex = wikipediaLink.url.lastIndexOf("/");
  if (lastSlashIndex === -1 || lastSlashIndex >= wikipediaLink.url.length - 1) {
    // no final component in url
    return null;
  }

  let title = wikipediaLink.url.substring(lastSlashIndex + 1);
  const path = `/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${title}&exchars=4000`;
  const body = await getUrl("https://en.wikipedia.org" + path);

  const keys = Object.keys(body.query.pages);
  if (keys.length !== 1) {
    return null;
  }

  let extract = body.query.pages[keys[0]].extract || "";
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

function getUrl(url) {
  return new Promise((resolve, reject) => {
    xrayWrapper.captureAsyncFunc("wikipedia get", subsegment => {
      request
        .get(url, { json: true })
        .then(response => {
          subsegment.close();
          resolve(response);
        })
        .catch(err => {
          subsegment.close(err);
          reject(err);
        });
    });
  });
}
