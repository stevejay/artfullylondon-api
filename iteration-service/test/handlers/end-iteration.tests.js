'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const iterationService = require('../../lib/services/iteration-service');
const handlerRunner = require('./handler-runner');
const endIteration = require('../../handlers/end-iteration');

describe('end-iteration.handler', () => {
  afterEach(() => {
    iterationService.endIteration.restore &&
      iterationService.endIteration.restore();
  });

  it('should end an iteration', done => {
    const event = {
      actionId: 'SomeActionId',
      startTimestamp: 12345678,
    };

    sinon
      .stub(iterationService, 'endIteration')
      .callsFake((actionId, startTimestamp) => {
        expect(actionId).to.eql('SomeActionId');
        expect(startTimestamp).to.eql(12345678);

        return Promise.resolve();
      });

    const expected = { acknowledged: true };

    handlerRunner(endIteration.handler, event, expected, done);
  });
});
