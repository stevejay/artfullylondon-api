import * as searchService from "../search-service";
import handleSnsMessage from "./handle-sns-message";

export const handler = handleSnsMessage(searchService.indexDocument);
