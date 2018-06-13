import "./tracing";
import * as searchService from "../search-service";
import withSnsMessageHandling from "./with-sns-message-handling";

export const handler = withSnsMessageHandling(searchService.indexDocument);
