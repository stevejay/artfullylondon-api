'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const iterationService = require('../../lib/services/iteration-service');
const handlerRunner = require('./handler-runner');
const startIteration = require('../../handlers/start-iteration');

describe('start-iteration.handler', () => {
  afterEach(() => {
    iterationService.startIteration.restore &&
      iterationService.startIteration.restore();
  });

  it('should start an iteration', done => {
    const event = { actionId: 'SomeActionId' };

    sinon.stub(iterationService, 'startIteration').callsFake(actionId => {
      expect(actionId).toEqual('SomeActionId');
      return Promise.resolve({ startTimestamp: 12345678 });
    });

    const expected = { startTimestamp: 12345678 };

    handlerRunner(startIteration.handler, event, expected, done);
  });
});
