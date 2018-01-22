'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const testData = require('../../test-data');
const createOrUpdateVenue = require('../../../handlers/venue/create-or-update-venue');
const venueService = require('../../../lib/services/venue-service');

describe('createOrUpdateVenue', () => {
  afterEach(() => {
    if (venueService.createOrUpdateVenue.restore) {
      venueService.createOrUpdateVenue.restore();
    }
  });

  it('should process create venue request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      pathParameters: null,
      query: null,
      body: JSON.stringify({ name: 'Almeida Theatre' }),
    };

    sinon.stub(venueService, 'createOrUpdateVenue').callsFake((id, params) => {
      expect(id).to.eql(null);
      expect(params).to.eql({ name: 'Almeida Theatre' });
      return Promise.resolve({ name: 'The Venue' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { name: 'The Venue' },
      },
    };

    proxyHandlerRunner(createOrUpdateVenue.handler, event, expected, done);
  });

  it('should process update venue request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      pathParameters: {
        id: testData.MINIMAL_VENUE_ID,
      },
      query: null,
      body: JSON.stringify({ name: 'Almeida Theatre' }),
    };

    sinon.stub(venueService, 'createOrUpdateVenue').callsFake((id, params) => {
      expect(id).to.eql(testData.MINIMAL_VENUE_ID);
      expect(params).to.eql({ name: 'Almeida Theatre' });
      return Promise.resolve({ name: 'The Venue' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { name: 'The Venue' },
      },
    };

    proxyHandlerRunner(createOrUpdateVenue.handler, event, expected, done);
  });
});
