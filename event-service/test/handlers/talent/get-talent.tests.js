'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const testData = require('../../test-data');
const getTalent = require('../../../handlers/talent/get-talent');
const talentService = require('../../../lib/services/talent-service');

describe('getTalent', () => {
  afterEach(() => {
    talentService.getTalent.restore();
  });

  it('should process admin get talent request', done => {
    const event = {
      pathParameters: {
        id: testData.INDIVIDUAL_TALENT_ID,
      },
      headers: {},
      resource: '/admin/foo',
      query: {},
    };

    sinon.stub(talentService, 'getTalent').callsFake((id, isPublicRequest) => {
      expect(id).to.eql(testData.INDIVIDUAL_TALENT_ID);
      expect(isPublicRequest).to.eql(false);
      return Promise.resolve({ name: 'The Talent' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'X-Artfully-Cache': 'Miss',
      },
      body: {
        entity: { name: 'The Talent' },
      },
    };

    proxyHandlerRunner(getTalent.handler, event, expected, done);
  });

  it('should process public get talent request', done => {
    const event = {
      pathParameters: {
        id: testData.INDIVIDUAL_TALENT_ID,
      },
      headers: {},
      resource: '/public/foo',
      query: {},
    };

    sinon.stub(talentService, 'getTalent').callsFake((id, isPublicRequest) => {
      expect(id).to.eql(testData.INDIVIDUAL_TALENT_ID);
      expect(isPublicRequest).to.eql(true);
      return Promise.resolve({ name: 'The Talent' });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=1800',
        ETag: '"20-hdbjacKlznXHL8CeqTTKKfzXnr4"',
        'X-Artfully-Cache': 'Miss',
      },
      body: {
        entity: { name: 'The Talent' },
      },
    };

    proxyHandlerRunner(getTalent.handler, event, expected, done);
  });
});
