'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const ses = require('../../lib/external-services/ses');
const emailService = require('../../lib/services/email-service');
const venueEventMonitorRepository = require('../../lib/persistence/venue-event-monitor-repository');
const venueMonitorRepository = require('../../lib/persistence/venue-monitor-repository');
const lambda = require('../../lib/external-services/lambda');
const constants = require('../../lib/constants');

process.env.SERVERLESS_GET_LATEST_ITERATION_ERRORS_LAMBDA_NAME =
  'GetLatestIterationErrors';

describe('email-service', () => {
  describe('sendMonitorStatusEmail', () => {
    afterEach(() => {
      venueEventMonitorRepository.getNewOrChanged.restore &&
        venueEventMonitorRepository.getNewOrChanged.restore();

      venueMonitorRepository.getChanged.restore &&
        venueMonitorRepository.getChanged.restore();

      lambda.invoke.restore && lambda.invoke.restore();
    });

    it('should process a valid request', done => {
      sinon
        .stub(venueEventMonitorRepository, 'getNewOrChanged')
        .callsFake(() =>
          Promise.resolve([
            { venueId: 'almeida-theatre' },
            { venueId: 'almeida-theatre' },
            { venueId: 'tate-modern' },
          ])
        );

      sinon
        .stub(venueMonitorRepository, 'getChanged')
        .callsFake(() =>
          Promise.resolve([
            { venueId: 'park-theatre' },
            { venueId: 'park-theatre' },
            { venueId: 'tate-britain' },
          ])
        );

      sinon.stub(lambda, 'invoke').callsFake((lambdaName, params) => {
        expect(lambdaName).to.eql('GetLatestIterationErrors');

        expect(params).to.eql({ actionId: constants.ITERATE_VENUES_ACTION_ID });

        return Promise.resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({
            errors: [{ entityId: 'bloomsbury', message: 'Some error' }],
          }),
        });
      });

      sinon.stub(ses, 'sendEmail').callsFake(email => {
        expect(email).to.eql({
          Destination: {
            ToAddresses: ['steve@stevejay.net'],
          },
          Message: {
            Body: {
              Text: {
                Data:
                  'Changed or New Events:\n\nalmeida-theatre\ntate-modern\n\nChanged Venue Data:\n\npark-theatre\ntate-britain\n\nLatest Errors:\n\nbloomsbury: Some error',
              },
            },
            Subject: {
              Data: 'Venue Monitor Email',
            },
          },
          Source: 'support@artfully.london',
        });

        return Promise.resolve();
      });

      emailService.sendMonitorStatusEmail().then(() => done()).catch(done);
    });
  });
});
