"use strict";

const snsPublish = require("aws-sns-publish");

exports.notify = (body, headers) => snsPublish(body, headers);
