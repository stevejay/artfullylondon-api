'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const testData = require('../../test-data');
const createOrUpdateTalent = require('../../../handlers/talent/create-or-update-talent');
const talentService = require('../../../lib/services/talent-service');

describe('createOrUpdateTalent', () => {
  afterEach(() => {
    if (talentService.createOrUpdateTalent.restore) {
      talentService.createOrUpdateTalent.restore();
    }
  });

  it('should process create talent request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      pathParameters: null,
      query: null,
      body: JSON.stringify({ lastName: 'Somename' }),
    };

    sinon
      .stub(talentService, 'createOrUpdateTalent')
      .callsFake((id, params) => {
        expect(id).to.eql(null);
        expect(params).to.eql({ lastName: 'Somename' });
        return Promise.resolve({ lastName: 'Savedname' });
      });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { lastName: 'Savedname' },
      },
    };

    proxyHandlerRunner(createOrUpdateTalent.handler, event, expected, done);
  });

  it('should process update talent request', done => {
    const event = {
      headers: testData.NORMAL_ADMIN_USER_REQUEST_HEADERS,
      pathParameters: {
        id: testData.INDIVIDUAL_TALENT_ID,
      },
      query: null,
      body: JSON.stringify({ lastName: 'Somename' }),
    };

    sinon
      .stub(talentService, 'createOrUpdateTalent')
      .callsFake((id, params) => {
        expect(id).to.eql(testData.INDIVIDUAL_TALENT_ID);
        expect(params).to.eql({ lastName: 'Somename' });
        return Promise.resolve({ lastName: 'Savedname' });
      });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { lastName: 'Savedname' },
      },
    };

    proxyHandlerRunner(createOrUpdateTalent.handler, event, expected, done);
  });
});
