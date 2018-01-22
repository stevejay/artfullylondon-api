'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const updateVenueMonitor = require('../../../handlers/venue-monitor/update-venue-monitor');
const venueMonitorService = require('../../../lib/services/venue-monitor-service');

describe('update-venue-monitor.handler', () => {
  afterEach(() => {
    venueMonitorService.updateVenueMonitor.restore &&
      venueMonitorService.updateVenueMonitor.restore();
  });

  it('should process a valid request', done => {
    const event = {
      pathParameters: {
        venueId: 'almeida-theatre',
      },
      headers: {},
      query: {},
      body: '{"isIgnored":true,"hasChanged":false}',
    };

    sinon.stub(venueMonitorService, 'updateVenueMonitor').callsFake(entity => {
      expect(entity).to.eql({
        venueId: 'almeida-theatre',
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

    proxyHandlerRunner(updateVenueMonitor.handler, event, expected, done);
  });
});
