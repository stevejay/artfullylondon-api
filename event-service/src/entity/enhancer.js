import * as wikipedia from "../external-services/wikipedia";

export async function addDescriptionFromWikipedia(params) {
  const wikipediaInfo = await wikipedia.getDescription(params);
  return { ...params, ...wikipediaInfo };
}
