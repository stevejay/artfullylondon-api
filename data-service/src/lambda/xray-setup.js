const AWSXRay = require("aws-xray-sdk");
if (!process.env.IS_OFFLINE) {
  AWSXRay.captureHTTPsGlobal(require("http"));
}
