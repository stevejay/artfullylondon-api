'use strict';

const expect = require('chai').expect;
const tag = require('../../lib/entity/tag');

describe('tag', () => {
  describe('createMediumWithStyleTag', () => {
    const tests = [
      {
        args: {
          mediumTag: { id: 'medium/architecture', label: 'architecture' },
          styleTag: { id: 'style/surreal', label: 'surreal' },
        },
        expected: {
          id: 'medium/architecture/surreal',
          label: 'surreal architecture',
        },
      },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.args)}`, () => {
        const result = tag.createMediumWithStyleTag(
          test.args.mediumTag,
          test.args.styleTag
        );

        expect(result).to.eql(test.expected);
      });
    });
  });
});
