import request from "request-promise-native";
import * as mapper from "./mapper";

const SITEMAP_EVENT_QUERY = `
  query SitemapEvent {
    sitemapEvent {
      results {
        id
      }
    }
  }
`;

export async function getSitemapFileText() {
  const result = await request({
    uri: `${process.env.SEARCH_SERVICE_HOST}/graphql`,
    json: true,
    body: { query: SITEMAP_EVENT_QUERY },
    method: "POST",
    timeout: 30000
  });
  const events = result.data.sitemapEvent.results;
  return mapper.mapToSitemapFileText(events);
}
