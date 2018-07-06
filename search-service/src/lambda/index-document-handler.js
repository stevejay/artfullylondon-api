import "./xray-setup";
import * as indexer from "../indexer";
import withSnsMessageHandling from "./with-sns-message-handling";

export const handler = withSnsMessageHandling(indexer.index);
