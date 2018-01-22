'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const handlerRunner = require('./handler-runner');
const createTag = require('../../handlers/create-tag');
const testData = require('../test-data');
const tagService = require('../../lib/services/tag-service');

describe('createTag', () => {
  afterEach(() => {
    tagService.createTag.restore && tagService.createTag.restore();
  });

  it('should process create tag request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      pathParameters: {
        type: 'geo',
      },
      body: JSON.stringify({
        label: 'USA',
      }),
    };

    sinon.stub(tagService, 'createTag').callsFake(request => {
      expect(request).eql({ type: 'geo', label: 'USA' });
      return Promise.resolve({ tag: { id: 'geo/usa', label: 'usa' } });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        tag: {
          id: 'geo/usa',
          label: 'usa',
        },
      },
    };

    handlerRunner(createTag.handler, event, expected, done);
  });
});
