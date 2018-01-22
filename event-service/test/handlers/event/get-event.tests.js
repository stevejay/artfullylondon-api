'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const getEvent = require('../../../handlers/event/get-event');
const eventService = require('../../../lib/services/event-service');

describe('get-event.handler', () => {
  afterEach(() => {
    eventService.getEvent.restore();
  });

  it('should process an admin get event request', done => {
    const event = {
      pathParameters: {
        id: 'almeida-theatre/2016/taming-of-the-shrew',
      },
      headers: {},
      resource: '/admin/foo',
      query: {},
    };

    sinon.stub(eventService, 'getEvent').callsFake((id, isPublicRequest) => {
      expect(id).to.eql('almeida-theatre/2016/taming-of-the-shrew');
      expect(isPublicRequest).to.eql(false);
      return Promise.resolve({ name: 'The Event' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'X-Artfully-Cache': 'Miss',
      },
      body: {
        entity: { name: 'The Event' },
      },
    };

    proxyHandlerRunner(getEvent.handler, event, expected, done);
  });

  it('should process a public get event request', done => {
    const event = {
      pathParameters: {
        id: 'almeida-theatre/2016/taming-of-the-shrew',
      },
      headers: {},
      resource: '/public/foo',
      query: {},
    };

    sinon.stub(eventService, 'getEvent').callsFake((id, isPublicRequest) => {
      expect(id).to.eql('almeida-theatre/2016/taming-of-the-shrew');
      expect(isPublicRequest).to.eql(true);
      return Promise.resolve({ name: 'The Event' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=1800',
        ETag: '"1f-VEYUJVQCcebnostk6lUBp5zA5S4"',
        'X-Artfully-Cache': 'Miss',
      },
      body: {
        entity: { name: 'The Event' },
      },
    };

    proxyHandlerRunner(getEvent.handler, event, expected, done);
  });
});
