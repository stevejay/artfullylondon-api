import "./xray-setup";
import withErrorHandling from "./with-error-handling";
import * as sitemapService from "../sitemap-service";
import convertAsyncToCallback from "./convert-async-to-callback";

export const handler = convertAsyncToCallback(
  withErrorHandling(async function() {
    return await sitemapService.getSitemapFileText();
  })
);
