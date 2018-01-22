'use strict';

const sinon = require('sinon');
const proxyHandlerRunner = require('./handler-runner');
const iterateVenues = require('../../handlers/iterate-venues');
const venueIterationService = require('../../lib/services/venue-iteration-service');

describe('iterate-venues.handler', () => {
  afterEach(() => {
    venueIterationService.startIteration.restore &&
      venueIterationService.startIteration.restore();
  });

  it('should process valid request', done => {
    const event = {
      pathParameters: {},
      headers: {},
      query: {},
    };

    sinon
      .stub(venueIterationService, 'startIteration')
      .callsFake(() => Promise.resolve());

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: { acknowledged: true },
    };

    proxyHandlerRunner(iterateVenues.handler, event, expected, done);
  });
});
