import XRay from "aws-xray-sdk";

export const captureAsyncFunc = process.env.IS_OFFLINE
  ? (name, callback) => {
      callback({ close: () => {} });
    }
  : XRay.captureAsyncFunc;
