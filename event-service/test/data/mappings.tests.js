'use strict';

const expect = require('chai').expect;
const mappings = require('../../lib/data/mappings');

describe('mappings', () => {
  describe('getPostcodeDistrict', () => {
    const tests = [
      { arg: 'N1 1EP', expected: 'N1' },
      { arg: 'N13 1EP', expected: 'N13' },
      { arg: 'W1S 2ET', expected: 'W1S' },
      { arg: 'something', expected: undefined },
      { arg: '', expected: undefined },
      { arg: null, expected: undefined },
      { arg: '   ', expected: undefined },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = mappings.getPostcodeDistrict(test.arg);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('removeCommonStartWords', () => {
    const tests = [
      { arg: 'the almeida theatre', expected: 'almeida theatre' },
      { arg: 'the stuff', expected: 'stuff' },
      { arg: 'a    thing of a note', expected: 'thing of a note' },
      { arg: '', expected: '' },
      { arg: '   ', expected: '   ' },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = mappings.removeCommonStartWords(test.arg);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapNameToSortName', () => {
    const tests = [
      { arg: 'ỆᶍǍᶆṔƚÉ áéíóúýčďěňřšťžů', expected: 'example aeiouycdenrstzu' },
      {
        arg: 'ỆᶍǍᶆṔƚÉ-áéíóúýčďěňřšťž | ů',
        expected: 'example-aeiouycdenrstz | u',
      },
      { arg: 'Foo Bar', expected: 'foo bar' },
      { arg: 'The Almeida The Theatre', expected: 'almeida the theatre' },
      { arg: 'A Way', expected: 'way' },
      { arg: '', expected: '' },
      { arg: null, expected: null },
      { arg: undefined, expected: undefined },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = mappings.mapNameToSortName(test.arg);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('hasLength', () => {
    const tests = [
      { arg: [], expected: false },
      { arg: null, expected: false },
      { arg: undefined, expected: false },
      { arg: '', expected: false },
      { arg: ' ', expected: true },
      { arg: [2, 5], expected: true },
      { arg: ['a', 'b'], expected: true },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = mappings.hasLength(test.arg);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestPrimitivesArrayToDbItem', () => {
    const tests = [
      {
        arg: [],
        expected: undefined,
      },
      {
        arg: null,
        expected: undefined,
      },
      {
        arg: ['a', 'b'],
        expected: ['a', 'b'],
      },
    ];
    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = mappings.mapRequestPrimitivesArrayToDbItem(test.arg);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestTagsToDbItem', () => {
    const tests = [
      {
        arg: undefined,
        expected: undefined,
      },
      {
        arg: [],
        expected: undefined,
      },
      {
        arg: [{ id: 'geo/usa', label: 'usa' }],
        expected: [{ id: 'geo/usa', label: 'usa' }],
      },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = mappings.mapRequestTagsToDbItem(test.arg);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestTimesRangesToDbItem', () => {
    const tests = [
      {
        it: 'should handle an empty times ranges array',
        arg: [],
        expected: {},
      },
      {
        it: 'should handle a null times ranges array',
        arg: null,
        expected: {},
      },
      {
        it: 'should handle an undefined times ranges array',
        arg: undefined,
        expected: {},
      },
      {
        it: 'should handle a populated times ranges array',
        arg: [
          {
            id: 'previews',
            label: 'Previews',
            dateFrom: '2017/01/20',
            dateTo: '2017/01/25',
          },
        ],
        expected: {
          timesRanges: [
            {
              id: 'previews',
              label: 'Previews',
              dateFrom: '2017/01/20',
              dateTo: '2017/01/25',
            },
          ],
        },
      },
    ];

    tests.map(test => {
      it(test.it, () => {
        const result = {};
        mappings.mapRequestTimesRangesToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestTalentsToDbItem', () => {
    const tests = [
      {
        arg: undefined,
        expected: {},
      },
      {
        arg: [],
        expected: {},
      },
      {
        arg: [{ id: 'foo', roles: ['Actor'] }],
        expected: { talents: [{ id: 'foo', roles: ['Actor'] }] },
      },
      {
        arg: [{ id: 'foo', roles: ['Actor'], characters: ['Polonius'] }],
        expected: {
          talents: [{ id: 'foo', roles: ['Actor'], characters: ['Polonius'] }],
        },
      },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = {};
        mappings.mapRequestTalentsToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestAdditionalOpeningTimesToDbItem', () => {
    const tests = [
      {
        arg: null,
        expected: {},
      },
      {
        arg: [],
        expected: {},
      },
      {
        arg: [{ date: '2016/08/19', from: '08:00', to: '12:00' }],
        expected: {
          additionalOpeningTimes: [
            { date: '2016/08/19', from: '08:00', to: '12:00' },
          ],
        },
      },
      {
        arg: [{ date: '2016/08/19', from: '08:00', to: '12:00' }],
        expected: {
          additionalOpeningTimes: [
            {
              date: '2016/08/19',
              from: '08:00',
              to: '12:00',
            },
          ],
        },
      },
      {
        arg: [{ date: '2016/08/19', from: '08:00', to: '12:00' }],
        expected: {
          additionalOpeningTimes: [
            {
              date: '2016/08/19',
              from: '08:00',
              to: '12:00',
            },
          ],
        },
      },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.args)}`, () => {
        const result = {};
        mappings.mapRequestAdditionalOpeningTimesToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestOpeningTimesClosuresToDbItem', () => {
    const tests = [
      {
        it: 'should handle null closures',
        arg: null,
        expected: {},
      },
      {
        it: 'should handle empty closures',
        arg: [],
        expected: {},
      },
      {
        it: 'should handle closure with time range',
        arg: [{ date: '2016/08/19', from: '08:00', to: '12:00' }],
        expected: {
          openingTimesClosures: [
            { date: '2016/08/19', from: '08:00', to: '12:00' },
          ],
        },
      },
      {
        it: 'should handle closure without time range',
        arg: [{ date: '2016/08/19' }],
        expected: {
          openingTimesClosures: [{ date: '2016/08/19' }],
        },
      },
    ];

    tests.map(test => {
      it(test.it, () => {
        const result = {};
        mappings.mapRequestOpeningTimesClosuresToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestPerformancesClosuresToDbItem', () => {
    const tests = [
      {
        it: 'should handle null closures',
        arg: null,
        expected: {},
      },
      {
        it: 'should handle empty closures',
        arg: [],
        expected: {},
      },
      {
        it: 'should handle closure with time',
        arg: [{ date: '2016/08/19', at: '08:00' }],
        expected: {
          performancesClosures: [{ date: '2016/08/19', at: '08:00' }],
        },
      },
      {
        it: 'should handle closure without time range',
        arg: [{ date: '2016/08/19' }],
        expected: {
          performancesClosures: [{ date: '2016/08/19' }],
        },
      },
    ];

    tests.map(test => {
      it(test.it, () => {
        const result = {};
        mappings.mapRequestPerformancesClosuresToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestNamedClosuresToDbItem', () => {
    const tests = [
      {
        it: 'should handle null named closures',
        arg: null,
        expected: {},
      },
      {
        it: 'should handle empty named closures',
        arg: [],
        expected: {},
      },
      {
        it: 'should handle named closures',
        arg: ['ChristmasDay', 'BoxingDay'],
        expected: {
          namedClosures: ['ChristmasDay', 'BoxingDay'],
        },
      },
    ];

    tests.map(test => {
      it(test.it, () => {
        const result = {};
        mappings.mapRequestNamedClosuresToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestSpecialOpeningTimesToDbItem', () => {
    const tests = [
      {
        it: 'should handle null special opening times',
        arg: null,
        expected: {},
      },
      {
        it: 'should handle empty special opening times',
        arg: [],
        expected: {},
      },
      {
        it: 'should handle special opening times with no tags',
        arg: [{ date: '2016/01/14', from: '15:00', to: '18:00' }],
        expected: {
          specialOpeningTimes: [
            { date: '2016/01/14', from: '15:00', to: '18:00' },
          ],
        },
      },
      {
        it: 'should handle special opening times with tags',
        arg: [
          {
            date: '2016/01/14',
            from: '15:00',
            to: '18:00',
            audienceTags: [{ id: 'audience/families', label: 'families' }],
          },
        ],
        expected: {
          specialOpeningTimes: [
            {
              date: '2016/01/14',
              from: '15:00',
              to: '18:00',
              audienceTags: [{ id: 'audience/families', label: 'families' }],
            },
          ],
        },
      },
      {
        it: 'should handle special opening times with null tags',
        arg: [
          {
            date: '2016/01/14',
            from: '15:00',
            to: '18:00',
            audienceTags: null,
          },
        ],
        expected: {
          specialOpeningTimes: [
            {
              date: '2016/01/14',
              from: '15:00',
              to: '18:00',
            },
          ],
        },
      },
      {
        it: 'should handle special opening times with empty tags',
        arg: [
          {
            date: '2016/01/14',
            from: '15:00',
            to: '18:00',
            audienceTags: [],
          },
        ],
        expected: {
          specialOpeningTimes: [
            {
              date: '2016/01/14',
              from: '15:00',
              to: '18:00',
            },
          ],
        },
      },
    ];

    tests.map(test => {
      it(test.it, () => {
        const result = {};
        mappings.mapRequestSpecialOpeningTimesToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestSpecialPerformancesToDbItem', () => {
    const tests = [
      {
        it: 'should handle null special performances',
        arg: null,
        expected: {},
      },
      {
        it: 'should handle empty special performances',
        arg: [],
        expected: {},
      },
      {
        it: 'should handle special performances with no tags',
        arg: [{ date: '2016/01/14', at: '15:00' }],
        expected: {
          specialPerformances: [{ date: '2016/01/14', at: '15:00' }],
        },
      },
      {
        it: 'should handle special performances with tags',
        arg: [
          {
            date: '2016/01/14',
            at: '15:00',
            audienceTags: [{ id: 'audience/families', label: 'families' }],
          },
        ],
        expected: {
          specialPerformances: [
            {
              date: '2016/01/14',
              at: '15:00',
              audienceTags: [{ id: 'audience/families', label: 'families' }],
            },
          ],
        },
      },
      {
        it: 'should handle special opening times with null tags',
        arg: [
          {
            date: '2016/01/14',
            at: '15:00',
            audienceTags: null,
          },
        ],
        expected: {
          specialPerformances: [
            {
              date: '2016/01/14',
              at: '15:00',
            },
          ],
        },
      },
      {
        it: 'should handle special opening times with empty tags',
        arg: [
          {
            date: '2016/01/14',
            at: '15:00',
            audienceTags: [],
          },
        ],
        expected: {
          specialPerformances: [
            {
              date: '2016/01/14',
              at: '15:00',
            },
          ],
        },
      },
    ];

    tests.map(test => {
      it(test.it, () => {
        const result = {};
        mappings.mapRequestSpecialPerformancesToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestAdditionalPerformancesToDbItem', () => {
    const tests = [
      {
        it: 'should handle null additional performances',
        arg: null,
        expected: {},
      },
      {
        it: 'should handle empty additional performances',
        arg: [],
        expected: {},
      },
      {
        it: 'should handle additional performances',
        arg: [{ date: '2016/01/15', at: '08:00' }],
        expected: {
          additionalPerformances: [{ date: '2016/01/15', at: '08:00' }],
        },
      },
    ];

    tests.map(test => {
      it(test.it, () => {
        const result = {};
        mappings.mapRequestAdditionalPerformancesToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestPerformancesToDbItem', () => {
    const tests = [
      {
        it: 'should handle null performances',
        arg: null,
        expected: {},
      },
      {
        it: 'should handle empty performances',
        arg: [],
        expected: {},
      },
      {
        it: 'should handle performances',
        arg: [{ day: 1, at: '08:00' }],
        expected: {
          performances: [{ day: 1, at: '08:00' }],
        },
      },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = {};
        mappings.mapRequestPerformancesToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestOpeningTimesToDbItem', () => {
    const tests = [
      {
        it: 'should handle null opening times',
        arg: null,
        expected: {},
      },
      {
        it: 'should handle empty opening times',
        arg: [],
        expected: {},
      },
      {
        it: 'should handle opening times',
        arg: [{ day: 1, from: '08:00', to: '12:00' }],
        expected: {
          openingTimes: [{ day: 1, from: '08:00', to: '12:00' }],
        },
      },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = {};
        mappings.mapRequestOpeningTimesToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestLinksToDbItem', () => {
    const tests = [
      {
        arg: [],
        expected: {},
      },
      {
        arg: [{ type: 'HomePage', url: 'http://test.com' }],
        expected: { links: [{ type: 'HomePage', url: 'http://test.com' }] },
      },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = {};
        mappings.mapRequestLinksToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestReviewsToDbItem', () => {
    const tests = [
      {
        arg: undefined,
        expected: {},
      },
      {
        arg: [],
        expected: {},
      },
      {
        arg: [{ source: 'foo', rating: 4 }],
        expected: { reviews: [{ source: 'foo', rating: 4 }] },
      },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = {};
        mappings.mapRequestReviewsToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapRequestImagesToDbItem', () => {
    const tests = [
      {
        arg: [],
        expected: {},
      },
      {
        arg: [
          {
            id: 'foo',
            ratio: 4.5,
            copyright: 'Credit',
            dominantColor: 'af0900',
          },
        ],
        expected: {
          images: [
            {
              id: 'foo',
              ratio: 4.5,
              copyright: 'Credit',
              dominantColor: 'af0900',
            },
          ],
        },
      },
      {
        arg: [{ id: 'foo', ratio: 4.5 }],
        expected: { images: [{ id: 'foo', ratio: 4.5 }] },
      },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = {};
        mappings.mapRequestImagesToDbItem(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });

  describe('mapMainImage', () => {
    const tests = [
      {
        arg: [
          { id: 'foo', copyright: 'foo credit' },
          { id: 'bar', copyright: 'bar credit' },
        ],
        expected: { image: 'foo', imageCopyright: 'foo credit' },
      },
      {
        arg: [
          {
            id: 'foo',
            copyright: 'foo credit',
            ratio: 1,
            dominantColor: '111111',
          },
          {
            id: 'bar',
            copyright: 'bar credit',
            ratio: 2,
            dominantColor: '222222',
          },
        ],
        expected: {
          image: 'foo',
          imageCopyright: 'foo credit',
          imageRatio: 1,
          imageColor: '111111',
        },
      },
      {
        arg: [{ id: 'foo' }, { id: 'bar' }],
        expected: { image: 'foo' },
      },
      {
        arg: [],
        expected: {},
      },
      {
        arg: null,
        expected: {},
      },
      {
        arg: undefined,
        expected: {},
      },
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(test.expected)} when passed ${JSON.stringify(test.arg)}`, () => {
        const result = {};
        mappings.mapMainImage(test.arg, result);
        expect(result).to.eql(test.expected);
      });
    });
  });
});
