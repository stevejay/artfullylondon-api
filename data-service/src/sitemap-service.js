import * as searcher from "./searcher";
import * as mapper from "./mapper";

export async function getSitemapFileText() {
  const eventIds = await searcher.getSitemapEventIds(new Date());
  return mapper.mapToSitemapFileText(eventIds);
}
