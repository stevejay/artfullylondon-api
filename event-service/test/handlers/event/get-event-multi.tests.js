'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const getEventMulti = require('../../../handlers/event/get-event-multi');
const eventService = require('../../../lib/services/event-service');

describe('get-event-multi.handler', () => {
  afterEach(() => {
    eventService.getEventMulti.restore();
  });

  it('should process get multiple request when ids are in the querystring', done => {
    const event = {
      queryStringParameters: {
        ids: 'tate-modern%2F2016%2Ftate-modern-permanent-collection,serpentine-sackler-gallery%2F2016%2Fzaha-hadid',
      },
      headers: {},
    };

    sinon.stub(eventService, 'getEventMulti').callsFake(ids => {
      expect(ids).to.eql([
        'tate-modern/2016/tate-modern-permanent-collection',
        'serpentine-sackler-gallery/2016/zaha-hadid',
      ]);

      return Promise.resolve([
        {
          id: 'tate-modern/2016/tate-modern-permanent-collection',
        },
        {
          id: 'serpentine-sackler-gallery/2016/zaha-hadid',
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
            id: 'tate-modern/2016/tate-modern-permanent-collection',
          },
          {
            id: 'serpentine-sackler-gallery/2016/zaha-hadid',
          },
        ],
      },
    };

    proxyHandlerRunner(getEventMulti.handler, event, expected, done);
  });

  it('should process get multiple request when ids are in the body', done => {
    const event = {
      body: JSON.stringify({
        ids: [
          'tate-modern/2016/tate-modern-permanent-collection',
          'serpentine-sackler-gallery/2016/zaha-hadid',
        ],
      }),
      headers: {},
    };

    sinon.stub(eventService, 'getEventMulti').callsFake(ids => {
      expect(ids).to.eql([
        'tate-modern/2016/tate-modern-permanent-collection',
        'serpentine-sackler-gallery/2016/zaha-hadid',
      ]);

      return Promise.resolve([
        {
          id: 'tate-modern/2016/tate-modern-permanent-collection',
        },
        {
          id: 'serpentine-sackler-gallery/2016/zaha-hadid',
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
            id: 'tate-modern/2016/tate-modern-permanent-collection',
          },
          {
            id: 'serpentine-sackler-gallery/2016/zaha-hadid',
          },
        ],
      },
    };

    proxyHandlerRunner(getEventMulti.handler, event, expected, done);
  });
});
