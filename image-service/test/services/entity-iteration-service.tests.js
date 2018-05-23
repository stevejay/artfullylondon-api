'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const entityIterationService = require('../../lib/services/entity-iteration-service');
const lambda = require('../../lib/external-services/lambda');
const sns = require('../../lib/external-services/sns');
const log = require('loglevel');

process.env.SERVERLESS_START_ITERATION_LAMBDA_NAME = 'StartIteration';
process.env.SERVERLESS_ADD_ITERATION_ERROR_LAMBDA_NAME = 'AddIterationError';
process.env.SERVERLESS_END_ITERATION_LAMBDA_NAME = 'EndIteration';

describe('entity-iteration-service', () => {
  afterEach(() => {
    lambda.invoke.restore && lambda.invoke.restore();
    sns.notify.restore && sns.notify.restore();
    log.error.restore && log.error.restore();
  });

  describe('startIteration', () => {
    it('should start an iteration', done => {
      sinon.stub(lambda, 'invoke').callsFake((lambdaName, params) => {
        expect(lambdaName).toEqual('StartIteration');
        expect(params).toEqual({ actionId: 'SomeActionId' });
        return Promise.resolve({ startTimestamp: 12345678 });
      });

      sinon.stub(sns, 'notify').callsFake((message, meta) => {
        expect(message).toEqual({
          startTimestamp: 12345678,
          lastId: null,
          retry: 0,
        });

        expect(meta).toEqual({ arn: 'SomeTopicArn' });

        return Promise.resolve();
      });

      entityIterationService
        .startIteration('SomeActionId', 'SomeTopicArn')
        .then(() => done())
        .catch(done);
    });
  });

  describe('addIterationError', () => {
    it('should add an iteration error', done => {
      sinon.stub(lambda, 'invoke').callsFake((lambdaName, params) => {
        expect(lambdaName).toEqual('AddIterationError');

        expect(params).toEqual({
          actionId: 'SomeActionId',
          startTimestamp: 12345678,
          entityId: 'entity-1',
          message: 'some message',
        });

        return Promise.resolve();
      });

      entityIterationService
        .addIterationError('some message', 'SomeActionId', 12345678, 'entity-1')
        .then(() => done())
        .catch(done);
    });

    it('should handle an exception being thrown when adding an iteration error', done => {
      sinon
        .stub(lambda, 'invoke')
        .callsFake(() => Promise.reject(new Error('deliberately thrown')));

      const logErrorStub = sinon.stub(log, 'error');

      entityIterationService
        .addIterationError('some message', 'SomeActionId', 12345678, 'entity-1')
        .then(() => {
          expect(logErrorStub.calledOnce).toEqual(true);
          done();
        })
        .catch(done);
    });
  });

  describe('throttleIteration', () => {
    it('should throttle an iteration', done => {
      entityIterationService
        .throttleIteration([0, 0], 250)
        .then(() => done())
        .catch(done);
    });
  });

  describe('invokeNextIteration', () => {
    it('should invoke the next iteration when the iteration end has not yet been reached', done => {
      sinon.stub(sns, 'notify').callsFake((message, meta) => {
        expect(message).toEqual({
          startTimestamp: 12345678,
          lastId: 'image-1',
          retry: 0,
        });

        expect(meta).toEqual({ arn: 'SomeTopicArn' });

        return Promise.resolve();
      });

      entityIterationService
        .invokeNextIteration(
          'image-1',
          12345678,
          'SomeActionId',
          'SomeTopicArn'
        )
        .then(() => done())
        .catch(done);
    });

    it('should signal the end of the iteration when the end has been reached', done => {
      sinon.stub(lambda, 'invoke').callsFake((lambdaName, params) => {
        expect(lambdaName).toEqual('EndIteration');

        expect(params).toEqual({
          actionId: 'SomeActionId',
          startTimestamp: 12345678,
        });

        return Promise.resolve();
      });

      entityIterationService
        .invokeNextIteration(null, 12345678, 'SomeActionId', 'SomeTopicArn')
        .then(() => done())
        .catch(done);
    });
  });
});
