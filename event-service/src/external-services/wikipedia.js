"use strict";

const request = require("request-promise-native");
const globalConstants = require("../constants");

exports.getDescription = async (description, credit, links) => {
  if (description) {
    // don't replace an existing description
    return {
      content: description,
      credit: credit
    };
  }

  const wikipediaLink = _getLinkByType(
    links,
    globalConstants.LINK_TYPE_WIKIPEDIA
  );

  if (!wikipediaLink) {
    // no wikipedia link given
    return {};
  }

  const lastSlashIndex = wikipediaLink.url.lastIndexOf("/");
  if (lastSlashIndex === -1 || lastSlashIndex >= wikipediaLink.url.length - 1) {
    // no final component in url
    return {};
  }

  let title = wikipediaLink.url.substring(lastSlashIndex + 1);

  const path = `/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=${title}&exchars=4000`;

  const body = await request.get("https://en.wikipedia.org" + path, {
    json: true
  });

  const keys = Object.keys(body.query.pages);
  if (keys.length !== 1) {
    return {};
  }

  let extract = body.query.pages[keys[0]].extract || "";
  const index = extract.indexOf("\n");

  if (index !== -1) {
    extract = extract.substring(0, index);
  }

  extract = extract.replace(/\.\.\.\.?$/, ".");

  return {
    content: extract.length > 10 ? "<p>" + extract + "</p>" : null
  };
};

function _getLinkByType(links, linkType) {
  const matches = (links || []).filter(link => link.type === linkType);
  return matches.length ? matches[0] : null;
}
