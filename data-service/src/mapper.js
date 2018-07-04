export function mapToSitemapFileText(events) {
  return events
    .map(event => `${process.env.SITEMAP_URL_PREFIX}/event/${event.id}`)
    .join("\n");
}
