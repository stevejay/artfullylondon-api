'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const imageService = require('../../lib/services/image-service');
const handlerRunner = require('./handler-runner');
const getImage = require('../../handlers/get-image');
const testData = require('../test-data');

describe('get-image', () => {
  afterEach(() => {
    imageService.getImageData.restore && imageService.getImageData.restore();
  });

  it('should process get image request', done => {
    const event = {
      pathParameters: {
        id: '12345678123456781234567812345678',
      },
    };

    sinon.stub(imageService, 'getImageData').callsFake(param => {
      expect(param).toEqual('12345678123456781234567812345678');

      return Promise.resolve({
        id: '12345678123456781234567812345678',
        width: 300,
        height: 600,
        imageType: 'venue',
        mimeType: 'image/png',
        sourceUrl: 'http://foo.com',
        dominantColor: '440000',
        modifiedDate: '2012-10-06T04:13:00.000Z',
        ratio: 2,
        resizeVersion: 0,
      });
    });

    const expected = {
      statusCode: 200,
      headers: testData.NORMAL_RESPONSE_HEADERS,
      body: {
        image: {
          id: '12345678123456781234567812345678',
          width: 300,
          height: 600,
          imageType: 'venue',
          mimeType: 'image/png',
          ratio: 2,
          sourceUrl: 'http://foo.com',
          dominantColor: '440000',
          resizeVersion: 0,
          modifiedDate: '2012-10-06T04:13:00.000Z',
        },
      },
    };

    handlerRunner(getImage.handler, event, expected, done);
  });

  it('should handle an exception being thrown', done => {
    const event = {
      pathParameters: {
        id: '12345678123456781234567812345678',
      },
    };

    sinon
      .stub(imageService, 'getImageData')
      .callsFake(() => Promise.reject(new Error('deliberately thrown')));

    const expected = {
      statusCode: 500,
      headers: testData.NORMAL_RESPONSE_HEADERS,
      body: { error: '[500] deliberately thrown' },
    };

    handlerRunner(getImage.handler, event, expected, done);
  });
});
