'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const getNextVenueHandler = require('../../../handlers/venue/get-next-venue').handler;
const venueService = require('../../../lib/services/venue-service');

describe('get-next-venue.handler', () => {
  afterEach(() => {
    if (venueService.getNextVenue.restore) {
      venueService.getNextVenue.restore();
    }
  });

  it('should handle a request', done => {
    const event = {
      lastId: 'almeida-theatre',
    };

    sinon.stub(venueService, 'getNextVenue').callsFake(lastId => {
      expect(lastId).to.eql('almeida-theatre');
      return Promise.resolve({ Items: [{ id: 'tate-modern' }] });
    });

    getNextVenueHandler(event, null, (err, result) => {
      if (err) {
        done(err);
      } else {
        if (result.venueId === 'tate-modern') {
          done();
        } else {
          done(new Error('wrong venue id'));
        }
      }
    });
  });

  it('should handle a request when there is no next venue', done => {
    const event = {
      lastId: 'almeida-theatre',
    };

    sinon.stub(venueService, 'getNextVenue').callsFake(lastId => {
      expect(lastId).to.eql('almeida-theatre');
      return Promise.resolve({ Items: [] });
    });

    getNextVenueHandler(event, null, (err, result) => {
      if (err) {
        done(err);
      } else {
        if (result.venueId === null) {
          done();
        } else {
          done(new Error('wrong venue id'));
        }
      }
    });
  });
});
