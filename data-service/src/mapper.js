export function mapToPlainTextLambdaResponse(body) {
  const response = {
    statusCode: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache"
    },
    body
  };

  return response;
}

export function mapToSitemapFileText(eventIds) {
  return eventIds
    .map(id => `${process.env.SITEMAP_URL_PREFIX}/event/${id}`)
    .join("\n");
}
