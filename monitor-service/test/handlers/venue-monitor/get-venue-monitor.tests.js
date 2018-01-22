'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const getVenueMonitor = require('../../../handlers/venue-monitor/get-venue-monitor');
const venueMonitorService = require('../../../lib/services/venue-monitor-service');

describe('get-venue-monitor.handler', () => {
  afterEach(() => {
    venueMonitorService.getVenueMonitor.restore &&
      venueMonitorService.getVenueMonitor.restore();
  });

  it('should process a valid request', done => {
    const event = {
      pathParameters: {
        venueId: 'almeida-theatre',
      },
      headers: {},
      query: {},
    };

    sinon.stub(venueMonitorService, 'getVenueMonitor').callsFake(venueId => {
      expect(venueId).to.eql('almeida-theatre');
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

    proxyHandlerRunner(getVenueMonitor.handler, event, expected, done);
  });
});
