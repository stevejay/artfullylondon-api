'use strict';

const expect = require('chai').expect;
const mappings = require('../../lib/data/mappings');

describe('mappings', () => {
  describe('mapRequestToDbTag', () => {
    const request = {
      type: 'geo',
      label: 'usa',
    };

    const result = mappings.mapRequestToDbTag('geo/usa', request);

    expect(result).to.eql({
      id: 'geo/usa',
      tagType: 'geo',
      label: 'usa',
    });
  });

  describe('mapDbTagToResponse', () => {
    const dbTag = {
      id: 'geo/usa',
      tagType: 'geo',
      label: 'usa',
    };

    const result = mappings.mapDbTagToResponse(dbTag);

    expect(result).to.eql({
      id: 'geo/usa',
      label: 'usa',
    });
  });
});
