'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const proxyHandlerRunner = require('../handler-runner');
const getTalentMulti = require('../../../handlers/talent/get-talent-multi');
const talentService = require('../../../lib/services/talent-service');

describe('get-talent-multi.handler', () => {
  afterEach(() => {
    talentService.getTalentMulti.restore();
  });

  it('should process get multiple request when ids are in querystring', done => {
    const event = {
      queryStringParameters: {
        ids: 'carrie-cracknell-director,philipe-parreno-artist',
      },
      headers: {},
    };

    sinon.stub(talentService, 'getTalentMulti').callsFake(ids => {
      expect(ids).to.eql([
        'carrie-cracknell-director',
        'philipe-parreno-artist',
      ]);

      return Promise.resolve([
        {
          id: 'carrie-cracknell-director',
        },
        {
          id: 'philipe-parreno-artist',
        },
      ]);
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entities: [
          {
            id: 'carrie-cracknell-director',
          },
          {
            id: 'philipe-parreno-artist',
          },
        ],
      },
    };

    proxyHandlerRunner(getTalentMulti.handler, event, expected, done);
  });

  it('should process get multiple request when ids are in the body', done => {
    const event = {
      body: JSON.stringify({
        ids: ['carrie-cracknell-director', 'philipe-parreno-artist'],
      }),
      headers: {},
    };

    sinon.stub(talentService, 'getTalentMulti').callsFake(ids => {
      expect(ids).to.eql([
        'carrie-cracknell-director',
        'philipe-parreno-artist',
      ]);

      return Promise.resolve([
        {
          id: 'carrie-cracknell-director',
        },
        {
          id: 'philipe-parreno-artist',
        },
      ]);
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entities: [
          {
            id: 'carrie-cracknell-director',
          },
          {
            id: 'philipe-parreno-artist',
          },
        ],
      },
    };

    proxyHandlerRunner(getTalentMulti.handler, event, expected, done);
  });
});
