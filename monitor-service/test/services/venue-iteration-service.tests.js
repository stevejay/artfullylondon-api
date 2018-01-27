'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const log = require('loglevel');
const venueIterationService = require('../../lib/services/venue-iteration-service');
const lambda = require('../../lib/external-services/lambda');
const sns = require('../../lib/external-services/sns');

process.env.SERVERLESS_START_ITERATION_LAMBDA_NAME = 'StartIteration';
process.env.SERVERLESS_ITERATE_VENUES_TOPIC_ARN = 'IterateVenuesTopicArn';
process.env.SERVERLESS_GET_NEXT_VENUE_LAMBDA_NAME = 'GetNextVenue';
process.env.SERVERLESS_ADD_ITERATION_ERROR_LAMBDA_NAME = 'AddIterationError';
process.env.SERVERLESS_END_ITERATION_LAMBDA_NAME = 'EndIteration';

describe('venue-iteration-service', () => {
  afterEach(() => {
    lambda.invoke.restore && lambda.invoke.restore();
    sns.notify.restore && sns.notify.restore();
  });

  describe('getNextVenue', () => {
    it('should get the next venue', done => {
      sinon.stub(lambda, 'invoke').callsFake((lambdaName, params) => {
        expect(lambdaName).to.eql('GetNextVenue');
        expect(params).to.eql({ lastId: 'almeida-theatre' });

        return Promise.resolve({ venueId: 'tate-modern' });
      });

      venueIterationService
        .getNextVenue('almeida-theatre')
        .then(result => {
          expect(result).to.eql('tate-modern');
          done();
        })
        .catch(done);
    });

    it('should handle there being no next venue', done => {
      sinon.stub(lambda, 'invoke').callsFake((lambdaName, params) => {
        expect(lambdaName).to.eql('GetNextVenue');
        expect(params).to.eql({ lastId: 'almeida-theatre' });

        return Promise.resolve(null);
      });

      venueIterationService
        .getNextVenue('almeida-theatre')
        .then(result => {
          expect(result).to.eql(null);
          done();
        })
        .catch(done);
    });

    it('should get the next venue when last venue id is null', done => {
      const lambdaStub = sinon
        .stub(lambda, 'invoke')
        .callsFake((lambdaName, payload) => {
          expect(lambdaName).to.eql('GetNextVenue');
          expect(payload).to.eql({ lastId: null });

          return { venueId: 'almeida-theatre' };
        });

      venueIterationService
        .getNextVenue(null)
        .then(result => {
          expect(result).to.eql('almeida-theatre');
          expect(lambdaStub.called).to.eql(true);
          done();
        })
        .catch(done);
    });
  });

  describe('startIteration', () => {
    it('should start an iteration', done => {
      sinon.stub(lambda, 'invoke').callsFake((lambdaName, params) => {
        expect(lambdaName).to.eql('StartIteration');
        expect(params).to.eql({ actionId: 'IterateVenueMonitors' });

        return Promise.resolve({ startTimestamp: 12345678 });
      });

      sinon.stub(sns, 'notify').callsFake((message, meta) => {
        expect(message).to.eql({
          startTimestamp: 12345678,
          lastId: null,
          retry: 0,
        });

        expect(meta).to.eql({ arn: 'IterateVenuesTopicArn' });

        return Promise.resolve();
      });

      venueIterationService.startIteration().then(() => done()).catch(done);
    });
  });

  describe('throttleIteration', () => {
    it('should throttle when action executes quickly', done => {
      const startTime = process.hrtime();

      venueIterationService
        .throttleIteration(startTime, 250)
        .then(done)
        .catch(done);
    });
  });

  describe('invokeNextIteration', () => {
    afterEach(() => {
      if (lambda.invoke.restore) {
        lambda.invoke.restore();
      }
      if (sns.notify.restore) {
        sns.notify.restore();
      }
    });

    it('should add SNS when there is another venue to iterate', done => {
      const snsStub = sinon.stub(sns, 'notify').callsFake(payload => {
        expect(payload).to.eql({
          startTimestamp: 123456,
          lastId: 'almeida-theatre',
          retry: 0,
        });

        return Promise.resolve();
      });

      venueIterationService
        .invokeNextIteration('almeida-theatre', 123456)
        .then(() => {
          expect(snsStub.called).to.eql(true);
          done();
        })
        .catch(done);
    });

    it('should invoke end of iteration lambda when there are no more venues to iterate', done => {
      const lambdaStub = sinon
        .stub(lambda, 'invoke')
        .callsFake((_, payload) => {
          expect(payload).to.eql({
            actionId: 'IterateVenueMonitors',
            startTimestamp: 123456,
          });

          return Promise.resolve();
        });

      venueIterationService
        .invokeNextIteration(null, 123456)
        .then(() => {
          expect(lambdaStub.called).to.eql(true);
          done();
        })
        .catch(done);
    });
  });

  describe('addIterationError', () => {
    afterEach(() => {
      lambda.invoke.restore && lambda.invoke.restore();
      log.error.restore && log.error.restore();
    });

    it('should add the error', done => {
      const lambdaStub = sinon
        .stub(lambda, 'invoke')
        .callsFake((_, payload) => {
          expect(payload).to.eql({
            actionId: 'IterateVenueMonitors',
            startTimestamp: 123456,
            entityId: 'almeida-theatre',
            message: 'foo',
          });

          return Promise.resolve();
        });

      const logStub = sinon.stub(log, 'error');

      venueIterationService
        .addIterationError(new Error('foo'), 'almeida-theatre', 123456)
        .then(() => {
          expect(lambdaStub.called).to.eql(true);
          expect(logStub.called).to.eql(true);
          done();
        })
        .catch(done);
    });

    it('should handle an exception being thrown when adding the error', done => {
      const lambdaStub = sinon.stub(lambda, 'invoke').callsFake(() => {
        return Promise.reject(new Error('deliberately thrown'));
      });

      sinon.stub(log, 'error');

      venueIterationService
        .addIterationError(new Error('foo'), 'almeida-theatre', 123456)
        .then(() => {
          expect(lambdaStub.called).to.eql(true);
          done();
        })
        .catch(done);
    });
  });
});
