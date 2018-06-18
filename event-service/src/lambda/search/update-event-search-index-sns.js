import * as searchIndexService from "../../search/search-index-service";
import withSnsMessageHandling from "../with-sns-message-handling";

export const handler = withSnsMessageHandling(
  searchIndexService.updateEventSearchIndex
);
