import "./xray-setup";
import * as indexService from "../index-service";
import withSnsMessageHandling from "./with-sns-message-handling";

export const handler = withSnsMessageHandling(indexService.indexDocument);
