'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const getVenueMonitors = require('../../../handlers/venue-monitor/get-venue-monitors');
const venueMonitorService = require('../../../lib/services/venue-monitor-service');

describe('get-venue-monitors.handler', () => {
  afterEach(() => {
    venueMonitorService.getVenueMonitors.restore &&
      venueMonitorService.getVenueMonitors.restore();
  });

  it('should process a valid request', done => {
    const event = {
      pathParameters: {
        venueId: 'almeida-theatre',
      },
      headers: {},
      query: {},
    };

    sinon.stub(venueMonitorService, 'getVenueMonitors').callsFake(venueId => {
      expect(venueId).to.eql('almeida-theatre');
      return Promise.resolve([{ title: 'test' }]);
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        items: [{ title: 'test' }],
      },
    };

    proxyHandlerRunner(getVenueMonitors.handler, event, expected, done);
  });
});
