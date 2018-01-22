'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const handlerRunner = require('./handler-runner');
const getTags = require('../../handlers/get-tags');
const tagService = require('../../lib/services/tag-service');

describe('getTags', () => {
  afterEach(() => {
    tagService.getTagsByType.restore && tagService.getTagsByType.restore();
  });

  it('should process get tags request', done => {
    const event = {
      pathParameters: {
        type: 'geo',
      },
    };

    sinon.stub(tagService, 'getTagsByType').callsFake(param => {
      expect(param).eql({ tagType: 'geo' });

      return Promise.resolve({
        tags: {
          geo: [
            { id: 'geo/usa', label: 'usa' },
            { id: 'geo/argentina', label: 'argentina' },
          ],
        },
      });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        tags: {
          geo: [
            { id: 'geo/usa', label: 'usa' },
            { id: 'geo/argentina', label: 'argentina' },
          ],
        },
      },
    };

    handlerRunner(getTags.handler, event, expected, done);
  });
});
