'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const getEventSeriesMulti = require('../../../handlers/event-series/get-event-series-multi');
const eventSeriesService = require('../../../lib/services/event-series-service');

describe('get-event-series-multi.handler', () => {
  afterEach(() => {
    eventSeriesService.getEventSeriesMulti.restore();
  });

  it('should process get multiple request when ids are in the querystring', done => {
    const event = {
      queryStringParameters: {
        ids: 'tate-modern-art,bang-said-the-gun',
      },
      headers: {},
    };

    sinon.stub(eventSeriesService, 'getEventSeriesMulti').callsFake(ids => {
      expect(ids).to.eql(['tate-modern-art', 'bang-said-the-gun']);

      return Promise.resolve([
        {
          id: 'tate-modern-art',
        },
        {
          id: 'bang-said-the-gun',
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
            id: 'tate-modern-art',
          },
          {
            id: 'bang-said-the-gun',
          },
        ],
      },
    };

    proxyHandlerRunner(getEventSeriesMulti.handler, event, expected, done);
  });

  it('should process get multiple request when ids are in the body', done => {
    const event = {
      body: JSON.stringify({
        ids: ['tate-modern-art', 'bang-said-the-gun'],
      }),
      headers: {},
    };

    sinon.stub(eventSeriesService, 'getEventSeriesMulti').callsFake(ids => {
      expect(ids).to.eql(['tate-modern-art', 'bang-said-the-gun']);

      return Promise.resolve([
        {
          id: 'tate-modern-art',
        },
        {
          id: 'bang-said-the-gun',
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
            id: 'tate-modern-art',
          },
          {
            id: 'bang-said-the-gun',
          },
        ],
      },
    };

    proxyHandlerRunner(getEventSeriesMulti.handler, event, expected, done);
  });
});
