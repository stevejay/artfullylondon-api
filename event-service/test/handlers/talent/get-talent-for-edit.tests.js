'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const testData = require('../../test-data');
const getTalentForEdit = require('../../../handlers/talent/get-talent-for-edit');
const talentService = require('../../../lib/talent/talent-service');

describe('get-talent-for-edit.handler', () => {
  afterEach(() => {
    talentService.getTalentForEdit.restore();
  });

  it('should process get request', done => {
    const event = {
      pathParameters: {
        id: testData.INDIVIDUAL_TALENT_ID,
      },
      headers: {},
      query: {},
    };

    sinon.stub(talentService, 'getTalentForEdit').callsFake(id => {
      expect(id).to.eql(testData.INDIVIDUAL_TALENT_ID);
      return Promise.resolve({ name: 'The Talent' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entity: { name: 'The Talent' },
      },
    };

    proxyHandlerRunner(getTalentForEdit.handler, event, expected, done);
  });
});
