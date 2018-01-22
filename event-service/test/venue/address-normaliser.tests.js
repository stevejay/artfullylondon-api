'use strict';

const expect = require('chai').expect;
const addressNormaliser = require('../../lib/venue/address-normaliser');

describe('venue address normaliser', () => {
  it('should normalise an address', () => {
    const address = '  23 The Gate  \r\n  \n Islington \n London\n\n\r\n\r\n   ';
    const result = addressNormaliser(address);
    expect(result).to.eql('23 The Gate\nIslington\nLondon');
  });
});
