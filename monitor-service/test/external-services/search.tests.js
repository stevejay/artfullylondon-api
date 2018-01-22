'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const request = require('request-promise-lite');
const search = require('../../lib/external-services/search');

describe('search', () => {
  describe('findEvents', () => {
    afterEach(() => {
      request.get.restore && request.get.restore();
    });

    it('should find existing events', done => {
      sinon.stub(request, 'get').callsFake((url, options) => {
        expect(url).to.eql(
          'https://api.artfully.london/search-service/admin/search/preset/by-external-event-id?id=a%20a%2Cb%20b'
        );

        expect(options).to.eql({ json: true });

        return Promise.resolve({
          items: [
            { id: 'some-id-a', externalEventId: 'a a' },
            { id: 'some-id-b', externalEventId: 'b b' },
          ],
        });
      });

      search
        .findEvents('almeida-theatre', ['a a', 'b b'])
        .then(response => {
          expect(response).to.eql(['some-id-a', 'some-id-b']);
          done();
        })
        .catch(done);
    });

    it('should handle no event match', done => {
      sinon.stub(request, 'get').callsFake((url, options) => {
        expect(url).to.eql(
          'https://api.artfully.london/search-service/admin/search/preset/by-external-event-id?id=a%20a'
        );

        expect(options).to.eql({ json: true });

        return Promise.resolve({
          items: [{ id: 'some-id-b', externalEventId: 'b b' }],
        });
      });

      search
        .findEvents('almeida-theatre', ['a a'])
        .then(response => {
          expect(response).to.eql([null]);
          done();
        })
        .catch(done);
    });
  });
});
