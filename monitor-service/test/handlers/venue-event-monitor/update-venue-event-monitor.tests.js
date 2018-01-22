'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const updateVenueEventMonitor = require('../../../handlers/venue-event-monitor/update-venue-event-monitor');
const venueEventMonitorService = require('../../../lib/services/venue-event-monitor-service');

describe('update-venue-event-monitor.handler', () => {
  afterEach(() => {
    venueEventMonitorService.updateVenueEventMonitor.restore &&
      venueEventMonitorService.updateVenueEventMonitor.restore();
  });

  it('should process a valid request', done => {
    const event = {
      pathParameters: {
        venueId: 'almeida-theatre',
        externalEventId: encodeURIComponent('almeida-theatre|/foo'),
      },
      headers: {},
      query: {},
      body: '{"isIgnored":true,"hasChanged":false}',
    };

    sinon
      .stub(venueEventMonitorService, 'updateVenueEventMonitor')
      .callsFake(entity => {
        expect(entity).to.eql({
          venueId: 'almeida-theatre',
          externalEventId: 'almeida-theatre|/foo',
          isIgnored: true,
          hasChanged: false,
        });

        return Promise.resolve();
      });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        acknowledged: true,
      },
    };

    proxyHandlerRunner(updateVenueEventMonitor.handler, event, expected, done);
  });
});
