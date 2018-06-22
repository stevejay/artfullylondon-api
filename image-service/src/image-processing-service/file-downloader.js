import request from "request";
import * as xrayWrapper from "../library-wrappers/xray-wrapper";
import * as fs from "fs";

export async function downloadToDisk(url, filePath) {
  return await new Promise((resolve, reject) => {
    xrayWrapper.captureAsyncFunc("download image", subsegment => {
      const pipe = request.get(url);

      pipe
        .on("error", err => {
          subsegment.close(err);
          reject(err);
        })
        .on("response", response => {
          if (response.statusCode !== 200) {
            const err = new Error(
              `Download file response code was ${response.statusCode}`
            );
            subsegment.close(err);
            reject(err);
            pipe.abort();
          }
        })
        .pipe(fs.createWriteStream(filePath))
        .on("finish", () => {
          subsegment.close();
          resolve();
        });
    });
  });
}
