'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const iterationService = require('../../lib/services/iteration-service');
const handlerRunner = require('./handler-runner');
const addIterationError = require('../../handlers/add-iteration-error');

describe('add-iteration-error.handler', () => {
  afterEach(() => {
    iterationService.addIterationError.restore &&
      iterationService.addIterationError.restore();
  });

  it('should add an iteration error', done => {
    const event = {
      actionId: 'SomeActionId',
      startTimestamp: 12345678,
      entityId: 'event-1',
      message: 'Some message',
    };

    sinon
      .stub(iterationService, 'addIterationError')
      .callsFake((actionId, startTimestamp, entityId, message) => {
        expect(actionId).to.eql('SomeActionId');
        expect(startTimestamp).to.eql(12345678);
        expect(entityId).to.eql('event-1');
        expect(message).to.eql('Some message');

        return Promise.resolve();
      });

    const expected = { acknowledged: true };

    handlerRunner(addIterationError.handler, event, expected, done);
  });
});
