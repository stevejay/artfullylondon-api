import AWS from "aws-sdk";
import XRay from "aws-xray-sdk";

if (!(process.env.IS_OFFLINE || process.env.NODE_ENV === "test")) {
  XRay.captureAWS(AWS);
  // TODO check if capturing http is needed for this service:
  XRay.captureHTTPsGlobal(require("http"));
}
