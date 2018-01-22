'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const testData = require('../test-data');
const writeAuthorizedDecorator = require('../../lib/lambda/write-authorized-decorator');

describe('write-authorized-decorator', () => {
  it('should handle a write authorized user', done => {
    const handlerSpy = sinon
      .stub()
      .callsFake((event, __, cb) => cb(null, event));

    const decorated = writeAuthorizedDecorator(handlerSpy);

    const event = {
      headers: {
        Authorization: testData.NORMAL_ADMIN_USER_JWT_TOKEN,
      },
    };

    decorated(event, null, (err, result) => {
      expect(err).to.eql(null);
      expect(result).to.eql(event);
      expect(handlerSpy.callCount).to.eql(1);
      done();
    });
  });

  it('should handle a non-write authorized user', done => {
    const handlerSpy = sinon
      .stub()
      .callsFake((_, __, cb) =>
        cb(new Error('wrapped handler should not get invoked'))
      );

    const decorated = writeAuthorizedDecorator(handlerSpy);

    const event = {
      headers: {
        Authorization: testData.READONLY_ADMIN_USER_JWT_TOKEN,
      },
    };

    decorated(event, null, (err, result) => {
      expect(err).to.eql(null);

      expect(result).to.eql({
        statusCode: 401,
        headers: testData.NORMAL_RESPONSE_HEADERS,
        body: '{"error":"[401] readonly user cannot modify system"}',
      });

      expect(handlerSpy.callCount).to.eql(0);
      done();
    });
  });
});
