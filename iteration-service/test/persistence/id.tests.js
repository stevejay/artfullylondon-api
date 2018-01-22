'use strict';

const expect = require('chai').expect;
const id = require('../../lib/persistence/id');

describe('id', () => {
  describe('createErrorKey', () => {
    it('should create an error key', () => {
      const actual = id.createErrorKey('SomeActionId', 12345678);
      expect(actual).to.eql('SomeActionId_12345678');
    });
  });
});
