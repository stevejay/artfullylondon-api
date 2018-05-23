'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const getVenueEventMonitors = require('../../../handlers/venue-event-monitor/get-venue-event-monitors');
const venueEventMonitorService = require('../../../lib/services/venue-event-monitor-service');

describe('get-venue-event-monitors.handler', () => {
  afterEach(() => {
    venueEventMonitorService.getVenueEventMonitorsForVenue.restore &&
      venueEventMonitorService.getVenueEventMonitorsForVenue.restore();
  });

  it('should process a valid request', done => {
    const event = {
      pathParameters: {
        venueId: 'almeida-theatre',
      },
      headers: {},
      query: {},
    };

    sinon
      .stub(venueEventMonitorService, 'getVenueEventMonitorsForVenue')
      .callsFake(venueId => {
        expect(venueId).toEqual('almeida-theatre');
        return Promise.resolve([{ title: 'test' }]);
      });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        venueId: 'almeida-theatre',
        items: [{ title: 'test' }],
      },
    };

    proxyHandlerRunner(getVenueEventMonitors.handler, event, expected, done);
  });
});
