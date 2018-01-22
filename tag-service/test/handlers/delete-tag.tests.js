'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const handlerRunner = require('./handler-runner');
const deleteTag = require('../../handlers/delete-tag');
const testData = require('../test-data');
const tagService = require('../../lib/services/tag-service');

describe('deleteTag', () => {
  afterEach(() => {
    tagService.deleteTag.restore && tagService.deleteTag.restore();
  });

  it('should process delete tag request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      pathParameters: {
        type: 'geo',
        idPart: 'usa',
      },
    };

    sinon.stub(tagService, 'deleteTag').callsFake(params => {
      expect(params).eql({ type: 'geo', idPart: 'usa' });
      return Promise.resolve();
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: { acknowledged: true },
    };

    handlerRunner(deleteTag.handler, event, expected, done);
  });
});
