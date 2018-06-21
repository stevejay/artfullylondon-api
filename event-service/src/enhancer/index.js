import * as wikipediaEnhancer from "./wikipedia-enhancer";
import * as request from "../external-services/request-wrapper";

export async function enhanceDescription(params) {
  const url = wikipediaEnhancer.createWikipediaUrl(params);
  if (!url) {
    return params;
  }
  const response = await request.get(url, "wikipedia");
  return { ...params, ...wikipediaEnhancer.parseWikipediaResponse(response) };
}
