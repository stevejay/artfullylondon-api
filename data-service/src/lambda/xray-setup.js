import XRay from "aws-xray-sdk";

if (!(process.env.IS_OFFLINE || process.env.NODE_ENV === "test")) {
  XRay.captureHTTPsGlobal(require("http"));
}
