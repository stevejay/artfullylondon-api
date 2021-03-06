import AWS from "aws-sdk";
import XRay from "aws-xray-sdk";

if (!(process.env.IS_OFFLINE || process.env.NODE_ENV === "test")) {
  XRay.captureAWS(AWS);
  XRay.captureHTTPsGlobal(require("http")); // for auth handler
}
