'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const getVenueMulti = require('../../../handlers/venue/get-venue-multi');
const venueService = require('../../../lib/venue/venue-service');

describe('get-venue-multi.handler', () => {
  afterEach(() => {
    venueService.getVenueMulti.restore();
  });

  it('should process get multiple request when ids are in querystring', done => {
    const event = {
      queryStringParameters: {
        ids: 'almeida-theatre,tate-modern',
      },
      headers: {},
    };

    sinon.stub(venueService, 'getVenueMulti').callsFake(ids => {
      expect(ids).to.eql(['almeida-theatre', 'tate-modern']);

      return Promise.resolve([
        {
          id: 'almeida-theatre',
        },
        {
          id: 'tate-modern',
        },
      ]);
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entities: [
          {
            id: 'almeida-theatre',
          },
          {
            id: 'tate-modern',
          },
        ],
      },
    };

    proxyHandlerRunner(getVenueMulti.handler, event, expected, done);
  });

  it('should process get multiple request when ids are in the body', done => {
    const event = {
      body: JSON.stringify({
        ids: ['almeida-theatre', 'tate-modern'],
      }),
      headers: {},
    };

    sinon.stub(venueService, 'getVenueMulti').callsFake(ids => {
      expect(ids).to.eql(['almeida-theatre', 'tate-modern']);

      return Promise.resolve([
        {
          id: 'almeida-theatre',
        },
        {
          id: 'tate-modern',
        },
      ]);
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entities: [
          {
            id: 'almeida-theatre',
          },
          {
            id: 'tate-modern',
          },
        ],
      },
    };

    proxyHandlerRunner(getVenueMulti.handler, event, expected, done);
  });
});
