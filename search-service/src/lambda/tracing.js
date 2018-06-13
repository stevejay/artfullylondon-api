import AWS from "aws-sdk";
import XRay from "aws-xray-sdk";
XRay.captureAWS(AWS);
