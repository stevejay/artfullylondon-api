"use strict";

const withErrorHandling = require("lambda-error-handler");
const withWriteAuthorization = require("../lambda/with-write-authorization");
const imageService = require("../services/image-service");

async function handler(event) {
  const body = JSON.parse(event.body);

  const request = {
    type: body.type,
    id: event.pathParameters.id,
    url: body.url
  };

  const image = await imageService.addImageToStore(request);
  return { body: { image } };
}

exports.handler = withWriteAuthorization(withErrorHandling(handler));
