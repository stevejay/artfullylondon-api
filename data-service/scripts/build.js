"use strict";

const fs = require("fs");

if (!fs.existsSync("./build")) {
  fs.mkdirSync("./build");
}

const obj = JSON.parse(fs.readFileSync("./content.json", "utf8"));
fs.writeFileSync("./build/content.txt", JSON.stringify(obj));
