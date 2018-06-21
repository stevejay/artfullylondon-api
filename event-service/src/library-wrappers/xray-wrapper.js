import XRay from "aws-xray-sdk";

export const captureAsyncFunc =
  process.env.IS_OFFLINE || process.env.NODE_ENV === "test"
    ? (name, callback) => {
        callback({ close: () => {} });
      }
    : XRay.captureAsyncFunc;
