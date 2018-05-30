"use strict";

const withErrorHandling = require("lambda-error-handler");
const withWriteAuthorization = require("../lambda/with-write-authorization");
const imageService = require("../services/image-service");

async function handler() {
  await imageService.startReprocessingImages();
  return { body: { acknowledged: true } };
}

exports.handler = withWriteAuthorization(withErrorHandling(handler));
