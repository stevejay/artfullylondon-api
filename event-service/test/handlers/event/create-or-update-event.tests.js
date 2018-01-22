'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const testData = require('../../test-data');
const createOrUpdateEvent = require('../../../handlers/event/create-or-update-event');
const eventService = require('../../../lib/services/event-service');

describe('create-or-update-event.handler', () => {
  afterEach(() => {
    if (eventService.createOrUpdateEvent.restore) {
      eventService.createOrUpdateEvent.restore();
    }
  });

  it('should process create event request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      pathParameters: null,
      query: null,
      body: JSON.stringify({ name: 'Param Name' }),
    };

    sinon.stub(eventService, 'createOrUpdateEvent').callsFake((id, params) => {
      expect(id).to.eql(null);
      expect(params).to.eql({ name: 'Param Name' });
      return Promise.resolve({ name: 'Saved Name' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { name: 'Saved Name' },
      },
    };

    proxyHandlerRunner(createOrUpdateEvent.handler, event, expected, done);
  });

  it('should process update event request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      pathParameters: { id: 'almeida-theatre/2016/taming-of-the-shrew' },
      query: null,
      body: JSON.stringify({ name: 'Param Name' }),
    };

    sinon.stub(eventService, 'createOrUpdateEvent').callsFake((id, params) => {
      expect(id).to.eql('almeida-theatre/2016/taming-of-the-shrew');
      expect(params).to.eql({ name: 'Param Name' });
      return Promise.resolve({ name: 'Saved Name' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { name: 'Saved Name' },
      },
    };

    proxyHandlerRunner(createOrUpdateEvent.handler, event, expected, done);
  });
});
