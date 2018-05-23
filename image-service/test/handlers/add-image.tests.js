'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const imageService = require('../../lib/services/image-service');
const handlerRunner = require('./handler-runner');
const addImage = require('../../handlers/add-image');
const testData = require('../test-data');

describe('add-image', () => {
  afterEach(() => {
    imageService.addImageToStore.restore &&
      imageService.addImageToStore.restore();
  });

  it('should process a valid request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      body: JSON.stringify({
        type: 'talent',
        url: 'https://foo.com/test.jpg',
      }),
      pathParameters: {
        id: '12345678123456781234567812345678',
      },
    };

    sinon.stub(imageService, 'addImageToStore').callsFake(param => {
      expect(param).toEqual({
        type: 'talent',
        id: '12345678123456781234567812345678',
        url: 'https://foo.com/test.jpg',
      });

      return Promise.resolve({ id: 1234 });
    });

    const expected = {
      statusCode: 200,
      headers: testData.NORMAL_RESPONSE_HEADERS,
      body: { image: { id: 1234 } },
    };

    handlerRunner(addImage.handler, event, expected, done);
  });

  it('should handle an exception being thrown', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      body: JSON.stringify({
        type: 'talent',
        url: 'https://foo.com/test.jpg',
      }),
      pathParameters: {
        id: '12345678123456781234567812345678',
      },
    };

    sinon
      .stub(imageService, 'addImageToStore')
      .callsFake(() => Promise.reject(new Error('deliberately thrown')));

    const expected = {
      statusCode: 500,
      headers: testData.NORMAL_RESPONSE_HEADERS,
      body: { error: '[500] deliberately thrown' },
    };

    handlerRunner(addImage.handler, event, expected, done);
  });
});
