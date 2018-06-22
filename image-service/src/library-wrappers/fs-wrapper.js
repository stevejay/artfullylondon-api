import * as fs from "fs";

export async function readFile(filePath) {
  return await new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export async function writeFile(filePath, content) {
  await new Promise((resolve, reject) => {
    fs.writeFile(filePath, content, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export async function deleteFile(filePath) {
  await new Promise(resolve => {
    fs.unlink(filePath, () => resolve());
  });
}
