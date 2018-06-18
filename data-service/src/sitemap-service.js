import request from "request-promise-native";
import * as mapper from "./mapper";

export async function getSitemapFileText() {
  const results = await request({
    uri: `${
      process.env.SEARCH_SERVICE_HOST
    }/search/preset/sitemap-event-ids?admin=true`,
    json: true,
    method: "GET",
    timeout: 30000
  });
  return mapper.mapToSitemapFileText(results);
}
