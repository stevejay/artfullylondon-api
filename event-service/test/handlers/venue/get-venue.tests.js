'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const testData = require('../../test-data');
const getVenue = require('../../../handlers/venue/get-venue');
const venueService = require('../../../lib/services/venue-service');

describe('getVenue', () => {
  afterEach(() => {
    venueService.getVenue.restore();
  });

  it('should process an admin request', done => {
    const event = {
      pathParameters: {
        id: testData.MINIMAL_VENUE_ID,
      },
      headers: {},
      resource: '/admin/foo',
      query: {},
    };

    sinon.stub(venueService, 'getVenue').callsFake((id, isPublicRequest) => {
      expect(id).to.eql(testData.MINIMAL_VENUE_ID);
      expect(isPublicRequest).to.eql(false);
      return Promise.resolve({ name: 'The Venue' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'X-Artfully-Cache': 'Miss',
      },
      body: {
        entity: { name: 'The Venue' },
      },
    };

    proxyHandlerRunner(getVenue.handler, event, expected, done);
  });
});
