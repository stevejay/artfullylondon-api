'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('./handler-runner');
const iterateVenuesSns = require('../../handlers/iterate-venues-sns');
const venueService = require('../../lib/services/venue-service');

describe('iterate-venues-sns.handler', () => {
  afterEach(() => {
    venueService.processNextVenue.restore &&
      venueService.processNextVenue.restore();
  });

  it('should handle a message', done => {
    const event = {
      Records: [
        {
          Sns: {
            Message: '{"lastId":"almeida-theatre","startTimestamp":12345678}',
          },
        },
      ],
    };

    sinon
      .stub(venueService, 'processNextVenue')
      .callsFake((lastId, startTimestamp) => {
        expect(lastId).to.eql('almeida-theatre');
        expect(startTimestamp).to.eql(12345678);
        return Promise.resolve();
      });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: { acknowledged: true },
    };

    proxyHandlerRunner(iterateVenuesSns.handler, event, expected, done);
  });
});
