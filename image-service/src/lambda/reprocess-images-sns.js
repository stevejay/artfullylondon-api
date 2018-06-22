import "./xray-setup";
import * as imageService from "../image-service";
import withSnsMessageHandling from "./with-sns-message-handling";

export const handler = withSnsMessageHandling(imageService.reprocessNextImage);
