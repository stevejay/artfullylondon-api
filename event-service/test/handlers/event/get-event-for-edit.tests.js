'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const getEventForEdit = require('../../../handlers/event/get-event-for-edit');
const eventService = require('../../../lib/services/event-service');

describe('get-event-for-edit.handler', () => {
  afterEach(() => {
    eventService.getEventForEdit.restore();
  });

  it('should process get request', done => {
    const event = {
      pathParameters: {
        id: 'almeida-theatre/2016/taming-of-the-shrew',
      },
      headers: {},
      query: {},
    };

    sinon.stub(eventService, 'getEventForEdit').callsFake(id => {
      expect(id).to.eql('almeida-theatre/2016/taming-of-the-shrew');
      return Promise.resolve({ name: 'The Name' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { name: 'The Name' },
      },
    };

    proxyHandlerRunner(getEventForEdit.handler, event, expected, done);
  });
});
