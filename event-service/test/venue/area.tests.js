'use strict';

const expect = require('chai').expect;
const area = require('../../lib/venue/area');

describe('area', () => {
  describe('getLondonArea', () => {
    const tests = [
      {
        arg: 'W1S',
        expected: 'Central'
      },
      {
        arg: 'W1',
        expected: 'Central'
      },
      {
        arg: 'W12',
        expected: 'West'
      },
      {
        arg: 'N4',
        expected: 'North'
      },
      {
        arg: 'E17',
        expected: 'East'
      },
      {
        arg: 'SE6',
        expected: 'SouthEast'
      },
      {
        arg: 'SW12',
        expected: 'SouthWest'
      },
      {
        arg: 'UB1',
        expected: 'West'
      },
      {
        arg: 'NW2',
        expected: 'North'
      },
      {
        arg: 'EC2N',
        expected: 'Central'
      }
    ];

    tests.map(test => {
      it(`should return ${test.expected} for postcode district ${test.arg}`, () => {
        const actual = area.getLondonArea(test.arg);
        expect(actual).to.eql(test.expected);
      });
    });

    it('should throw if the postcode district was not matched', () => {
      expect(() => area.getLondonArea('foo')).to.throw();
    });
  });
});
