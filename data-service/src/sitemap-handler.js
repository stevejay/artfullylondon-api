import withErrorHandling from "lambda-error-handler";
import * as sitemapService from "./sitemap-service";
import * as mapper from "./mapper";

export const handler = withErrorHandling(async function() {
  const text = await sitemapService.getSitemapFileText();
  return mapper.mapToPlainTextLambdaResponse(text);
});
