"use strict";

const withErrorHandling = require("lambda-error-handler");
const imageService = require("../services/image-service");

async function handler(event) {
  const image = await imageService.getImageData(event.pathParameters.id);
  return { body: { image } };
}

exports.handler = generatorHandler(handler);
