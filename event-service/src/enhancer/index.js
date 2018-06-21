import * as wikipediaEnhancer from "./wikipedia-enhancer";
import * as requestWrapper from "../library-wrappers/request-wrapper";

export async function enhanceDescription(params) {
  const url = wikipediaEnhancer.createWikipediaUrl(params);
  if (!url) {
    return params;
  }
  const response = await requestWrapper.get(url, "wikipedia");
  return { ...params, ...wikipediaEnhancer.parseWikipediaResponse(response) };
}
