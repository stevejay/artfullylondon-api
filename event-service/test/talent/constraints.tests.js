'use strict';

const expect = require('chai').expect;
const ensure = require('ensure-request').ensure;
const testData = require('../test-data');
const constraints = require('../../lib/talent/constraints');
const ensureErrorHandler = require('../../lib/data/ensure-error-handler');

describe('talent constraints', () => {
  it('should pass a fully populated individual talent', () => {
    const params = testData.createFullIndividualRequestTalent();
    expect(() =>
      ensure(params, constraints, ensureErrorHandler)).to.not.throw();
  });

  it('should pass a minimally populated individual talent', () => {
    const params = testData.createMinimalIndividualRequestTalent();
    expect(() =>
      ensure(params, constraints, ensureErrorHandler)).to.not.throw();
  });

  it('should pass a fully populated group talent', () => {
    const params = testData.createFullGroupRequestTalent();
    expect(() =>
      ensure(params, constraints, ensureErrorHandler)).to.not.throw();
  });

  it('should pass a minimally populated group talent', () => {
    const params = testData.createMinimalGroupRequestTalent();
    expect(() =>
      ensure(params, constraints, ensureErrorHandler)).to.not.throw();
  });

  it('should fail a group talent with first names', () => {
    const params = testData.createMinimalGroupRequestTalent();
    params.firstNames = 'Steve';
    expect(() => ensure(params, constraints, ensureErrorHandler)).to.throw(
      '[400] Bad Request: first names should be blank for group talent'
    );
  });
});
