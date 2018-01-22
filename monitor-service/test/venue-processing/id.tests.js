'use strict';

const expect = require('chai').expect;
const id = require('../../lib/venue-processing/id');

describe('id', function() {
  describe('createExternalEventId', () => {
    const tests = [
      {
        it: 'should handle http event url',
        args: {
          venueId: 'almeida-theatre',
          eventUrl: 'http://foo.com/bar/bat',
        },
        expected: 'almeida-theatre|/bar/bat',
      },
      {
        it: 'should handle https event url',
        args: {
          venueId: 'almeida-theatre',
          eventUrl: 'HTTPS://foo.com/bar/bat',
        },
        expected: 'almeida-theatre|/bar/bat',
      },
      {
        it: 'should handle url of only a hostname',
        args: {
          venueId: 'almeida-theatre',
          eventUrl: 'HTTPS://foo.com',
        },
        expected: 'almeida-theatre|/',
      },
    ];

    tests.map(test => {
      it(test.it, () => {
        const result = id.createExternalEventId(
          test.args.venueId,
          test.args.eventUrl
        );

        expect(result).to.eql(test.expected);
      });
    });
  });
});
