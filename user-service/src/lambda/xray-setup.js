import AWS from "aws-sdk";
import XRay from "aws-xray-sdk";

if (!process.env.IS_OFFLINE) {
  XRay.captureAWS(AWS);
}
