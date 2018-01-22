'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const esSearch = require('../../lib/external-services/elasticsearch');
const subject = require('../../lib/services/search');

describe('search', () => {
  describe('getSitemapLinks', () => {
    afterEach(() => {
      if (esSearch.search.restore) {
        esSearch.search.restore();
      }
    });

    it('should get sitemap links', done => {
      sinon.stub(esSearch, 'search').callsFake(param => {
        expect(param.index).to.eql('event-full');
        expect(param.body.query.bool.should).to.eql([
          { term: { occurrenceType: 'Continuous' } },
          { range: { dateTo: { gte: '2017/04/07' } } },
        ]);

        return Promise.resolve({
          hits: { hits: [{ _source: { id: 'a/b/c' } }] },
        });
      });

      const expected = ['https://www.artfully.london/event/a/b/c'];

      subject
        .getSitemapLinks(new Date(1491560202450))
        .then(actual => {
          expect(actual).to.eql(expected);
          done();
        })
        .catch(done);
    });
  });
});
