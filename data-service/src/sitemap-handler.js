import esClient from "./es-client";
import SearchService from "./search-service";
const searchService = new SearchService(esClient);

exports.handler = async () => {
  try {
    const links = await searchService.getSitemapLinks(new Date());
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: links.join("\n")
    };
  } catch (err) {
    return err;
  }
};
