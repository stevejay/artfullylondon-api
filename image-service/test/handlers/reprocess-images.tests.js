'use strict';

const sinon = require('sinon');
const handlerRunner = require('./handler-runner');
const reprocessImages = require('../../handlers/reprocess-images');
const imageService = require('../../lib/services/image-service');
const testData = require('../test-data');

describe('reprocess-images.handler', () => {
  afterEach(() => {
    imageService.startReprocessingImages.restore &&
      imageService.startReprocessingImages.restore();
  });

  it('should process a request to reprocess all images', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
    };

    sinon
      .stub(imageService, 'startReprocessingImages')
      .callsFake(() => Promise.resolve());

    const expected = {
      statusCode: 200,
      headers: testData.NORMAL_RESPONSE_HEADERS,
      body: { acknowledged: true },
    };

    handlerRunner(reprocessImages.handler, event, expected, done);
  });

  it('should handle an exception being thrown', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
    };

    sinon
      .stub(imageService, 'startReprocessingImages')
      .callsFake(() => Promise.reject(new Error('deliberately thrown')));

    const expected = {
      statusCode: 500,
      headers: testData.NORMAL_RESPONSE_HEADERS,
      body: { error: '[500] deliberately thrown' },
    };

    handlerRunner(reprocessImages.handler, event, expected, done);
  });
});
