export function mapToSitemapFileText(results) {
  return results.items
    .map(item => `${process.env.SITEMAP_URL_PREFIX}/event/${item.id}`)
    .join("\n");
}
