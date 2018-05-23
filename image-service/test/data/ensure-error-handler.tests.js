'use strict';

const expect = require('chai').expect;
const ensureErrorHandler = require('../../lib/data/ensure-error-handler');

describe('ensure-error-handler', () => {
  it('should throw an exception with the specified errors', () => {
    // TODO: I couldn't get expect(...).to.throw working here.
    try {
      ensureErrorHandler(['foo', 'bar']);
      throw new Error('should have thrown an exception');
    } catch (err) {
      expect(err.message).toEqual('[400] Bad Request: foo; bar');
    }
  });
});
