import withErrorHandling from "lambda-error-handler";
import ESClient from "./es-client";
import SitemapService from "./sitemap-service";

const searcher = new ESClient(process.env.ELASTICSEARCH_HOST);

const sitemapService = new SitemapService(
  searcher,
  process.env.SITEMAP_URL_PREFIX
);

async function handlerImpl() {
  const links = await sitemapService.getSitemapEventLinks(new Date());

  return {
    statusCode: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache"
    },
    body: links.join("\n")
  };
}

export const handler = withErrorHandling(handlerImpl);
