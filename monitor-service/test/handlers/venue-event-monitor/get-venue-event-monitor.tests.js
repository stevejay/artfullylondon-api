'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const getVenueEventMonitor = require('../../../handlers/venue-event-monitor/get-venue-event-monitor');
const venueEventMonitorService = require('../../../lib/services/venue-event-monitor-service');

describe('get-venue-event-monitor.handler', () => {
  afterEach(() => {
    venueEventMonitorService.getVenueEventMonitor.restore &&
      venueEventMonitorService.getVenueEventMonitor.restore();
  });

  it('should process a valid request', done => {
    const event = {
      pathParameters: {
        venueId: 'almeida-theatre',
        externalEventId: encodeURIComponent('almeida-theatre|/foo'),
      },
      headers: {},
      query: {},
    };

    sinon
      .stub(venueEventMonitorService, 'getVenueEventMonitor')
      .callsFake((venueId, externalEventId) => {
        expect(venueId).toEqual('almeida-theatre');
        expect(externalEventId).toEqual('almeida-theatre|/foo');

        return Promise.resolve({ title: 'test' });
      });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { title: 'test' },
      },
    };

    proxyHandlerRunner(getVenueEventMonitor.handler, event, expected, done);
  });
});
