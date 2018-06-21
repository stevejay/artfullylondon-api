import * as searchIndexService from "../../search-index-service";
import withSnsMessageHandling from "../with-sns-message-handling";

export const handler = withSnsMessageHandling(
  searchIndexService.processRefreshSearchIndexMessage
);
