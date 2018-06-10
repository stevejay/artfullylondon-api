import request from "request-promise-native";
import * as mapper from "./mapper";

export async function getSitemapFileText() {
  const results = await request({
    uri: `${
      process.env.SEARCH_SERVICE_HOST
    }/admin/search/preset/sitemap-event-ids`,
    json: true,
    method: "GET",
    timeout: 30000
  });
  return mapper.mapToSitemapFileText(results);
}
