'use strict';

const sinon = require('sinon');
const handlerRunner = require('./handler-runner');
const getAllTags = require('../../handlers/get-all-tags');
const tagService = require('../../lib/services/tag-service');

describe('getAllTags', () => {
  afterEach(() => {
    tagService.getAllTags.restore && tagService.getAllTags.restore();
  });

  it('should process get tags request', done => {
    sinon.stub(tagService, 'getAllTags').callsFake(() => {
      return Promise.resolve({
        tags: {
          geo: [
            { id: 'geo/usa', label: 'usa' },
            { id: 'geo/argentina', label: 'argentina' },
          ],
          style: [
            { id: 'style/contemporary', label: 'contemporary' },
            { id: 'style/surreal', label: 'surreal' },
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
          style: [
            { id: 'style/contemporary', label: 'contemporary' },
            { id: 'style/surreal', label: 'surreal' },
          ],
        },
      },
    };

    handlerRunner(getAllTags.handler, null, expected, done);
  });
});
