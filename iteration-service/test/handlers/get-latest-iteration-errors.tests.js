'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const iterationService = require('../../lib/services/iteration-service');
const handlerRunner = require('./handler-runner');
const getLatestIterationErrors = require('../../handlers/get-latest-iteration-errors');

describe('get-latest-iteration-errors.handler', () => {
  afterEach(() => {
    iterationService.getLatestIterationErrors.restore &&
      iterationService.getLatestIterationErrors.restore();
  });

  it('should get the latest iteration errors when invoked via HTTP', done => {
    const event = {
      pathParameters: { actionId: 'SomeActionId' },
    };

    sinon
      .stub(iterationService, 'getLatestIterationErrors')
      .callsFake(actionId => {
        expect(actionId).to.eql('SomeActionId');
        return Promise.resolve([{ id: '1' }, { id: '2' }]);
      });

    const expected = {
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: { errors: [{ id: '1' }, { id: '2' }] },
    };

    handlerRunner(getLatestIterationErrors.handler, event, expected, done);
  });

  it('should get the latest iteration errors when invoked as lambda', done => {
    const event = {
      actionId: 'SomeActionId',
    };

    sinon
      .stub(iterationService, 'getLatestIterationErrors')
      .callsFake(actionId => {
        expect(actionId).to.eql('SomeActionId');
        return Promise.resolve([{ id: '1' }, { id: '2' }]);
      });

    const expected = {
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      statusCode: 200,
      body: { errors: [{ id: '1' }, { id: '2' }] },
    };

    handlerRunner(getLatestIterationErrors.handler, event, expected, done);
  });
});
