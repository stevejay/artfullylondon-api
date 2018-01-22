'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const testData = require('../../test-data');
const getVenueForEdit = require('../../../handlers/venue/get-venue-for-edit');
const venueService = require('../../../lib/services/venue-service');

describe('get-venue-for-edit.handler', () => {
  afterEach(() => {
    venueService.getVenueForEdit.restore();
  });

  it('should process get request', done => {
    const event = {
      pathParameters: {
        id: testData.MINIMAL_VENUE_ID,
      },
      headers: {},
      query: {},
    };

    sinon.stub(venueService, 'getVenueForEdit').callsFake(id => {
      expect(id).to.eql(testData.MINIMAL_VENUE_ID);
      return { name: 'Almeida Theatre' };
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { name: 'Almeida Theatre' },
      },
    };

    proxyHandlerRunner(getVenueForEdit.handler, event, expected, done);
  });
});
