'use strict';

const sinon = require('sinon');
const proxyHandlerRunner = require('./handler-runner');
const sendMonitorStatusEmail = require('../../handlers/send-monitor-status-email');
const emailService = require('../../lib/services/email-service');

describe('send-monitor-status-email.handler', () => {
  afterEach(() => {
    emailService.sendMonitorStatusEmail.restore &&
      emailService.sendMonitorStatusEmail.restore();
  });

  it('should process a valid request', done => {
    const event = {
      pathParameters: {},
      headers: {},
      query: {},
    };

    sinon
      .stub(emailService, 'sendMonitorStatusEmail')
      .callsFake(() => Promise.resolve());

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        acknowledged: true,
      },
    };

    proxyHandlerRunner(sendMonitorStatusEmail.handler, event, expected, done);
  });
});
