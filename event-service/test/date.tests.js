'use strict';

const expect = require('chai').expect;
const date = require('../lib/date');

describe('getTodayAsStringDate', () => {
  it('should create a string date', () => {
    const result = date.getTodayAsStringDate();
    expect(result).to.match(/^\d\d\d\d\/\d\d\/\d\d$/);
  });
});