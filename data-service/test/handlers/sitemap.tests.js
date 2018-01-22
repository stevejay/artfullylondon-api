'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const log = require('loglevel');
const subject = require('../../handlers/sitemap');
const search = require('../../lib/services/search');

describe('sitemap.handler', () => {
  beforeEach(() => sinon.stub(log, 'error').callsFake(() => {}));

  afterEach(() => {
    search.getSitemapLinks.restore && search.getSitemapLinks.restore();
    log.error.restore && log.error.restore();
  });

  it('should handle a valid request', done => {
    sinon
      .stub(search, 'getSitemapLinks')
      .callsFake(() =>
        Promise.resolve(['http://foo.com/a', 'http://foo.com/b'])
      );

    const expected = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
      },
      body: 'http://foo.com/a\nhttp://foo.com/b',
    };

    invokeHandler(subject.handler)
      .then(actual => {
        expect(actual).to.eql(expected);
        done();
      })
      .catch(done);
  });

  it('should handle an expection', done => {
    sinon
      .stub(search, 'getSitemapLinks')
      .callsFake(() => Promise.reject(new Error('deliberately thrown')));

    const expected = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: '{"error":"[500] deliberately thrown"}',
    };

    invokeHandler(subject.handler)
      .then(actual => {
        expect(actual).to.eql(expected);
        done();
      })
      .catch(done);
  });
});

function invokeHandler(handler) {
  return new Promise((resolve, reject) => {
    handler(null, null, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}
