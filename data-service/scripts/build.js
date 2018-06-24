"use strict";
const fs = require("fs");

const BUILD_DIR_PATH = "./build";

if (!fs.existsSync(BUILD_DIR_PATH)) {
  fs.mkdirSync(BUILD_DIR_PATH);
}

const obj = JSON.parse(fs.readFileSync("./content.json", "utf8"));
fs.writeFileSync(BUILD_DIR_PATH + "/content.txt", JSON.stringify(obj));
