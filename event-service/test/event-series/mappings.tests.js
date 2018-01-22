'use strict';

const expect = require('chai').expect;
const constants = require('../../lib/event-series/constants');
const testData = require('../test-data');
const mappings = require('../../lib/event-series/mappings');

describe('event series mappings', () => {
  describe('mapRequestToDbItem', () => {
    it('should map a minimal event series', () => {
      const params = testData.createMinimalRequestEventSeries();

      const result = mappings.mapRequestToDbItem(
        testData.EVENT_SERIES_ID,
        params
      );

      expect(result).to.eql({
        id: testData.EVENT_SERIES_ID,
        name: 'Bang Said The Gun',
        status: 'Active',
        eventSeriesType: 'Occasional',
        occurrence: 'Third Thursday of each month',
        summary: 'A poetry riot',
        description: 'Poetry for people who dont like poetry.',
        version: 1,
        schemeVersion: constants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
      });
    });

    it('should map a fully populated event series', () => {
      const params = testData.createFullRequestEventSeries();

      const result = mappings.mapRequestToDbItem(
        testData.EVENT_SERIES_ID,
        params
      );

      expect(result).to.eql({
        id: testData.EVENT_SERIES_ID,
        name: 'Bang Said The Gun',
        status: 'Active',
        eventSeriesType: 'Occasional',
        occurrence: 'Third Thursday of each month',
        summary: 'A poetry riot',
        description: 'Poetry for people who dont like poetry.',
        descriptionCredit: 'Some description credit',
        links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
        images: [
          {
            id: 'abcd1234abcd1234abcd1234abcd1234',
            ratio: 1.2,
            copyright: 'Foo',
          },
        ],
        weSay: 'something',
        version: 1,
        schemeVersion: constants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
      });
    });
  });

  describe('mapDbItemToAdminResponse', () => {
    it('should map a minimal event series', () => {
      const dbItem = testData.createMinimalDbEventSeries();

      const result = mappings.mapDbItemToAdminResponse(dbItem);

      expect(result).to.eql({
        id: testData.EVENT_SERIES_ID,
        status: 'Active',
        name: 'Bang Said The Gun',
        eventSeriesType: 'Occasional',
        occurrence: 'Third Thursday of each month',
        summary: 'A poetry riot',
        description: 'Poetry for people who dont like poetry.',
        version: 1,
        schemeVersion: constants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
      });
    });

    it('should map a fully populated event series', () => {
      const dbItem = testData.createFullDbEventSeries();

      const result = mappings.mapDbItemToAdminResponse(dbItem);

      expect(result).to.eql({
        id: testData.EVENT_SERIES_ID,
        status: 'Active',
        name: 'Bang Said The Gun',
        eventSeriesType: 'Occasional',
        occurrence: 'Third Thursday of each month',
        summary: 'A poetry riot',
        description: 'Poetry for people who dont like poetry.',
        descriptionCredit: 'Some description credit',
        links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
        images: [
          {
            id: 'abcd1234abcd1234abcd1234abcd1234',
            ratio: 1.2,
            copyright: 'Foo',
          },
        ],
        weSay: 'something',
        version: 1,
        schemeVersion: constants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
      });
    });
  });

  describe('mapDbItemToPublicSummaryResponse', () => {
    it('should map a fully populated event series', () => {
      const dbItem = testData.createFullDbEventSeries();

      const result = mappings.mapDbItemToPublicSummaryResponse(dbItem);

      expect(result).to.eql({
        entityType: 'event-series',
        id: testData.EVENT_SERIES_ID,
        status: 'Active',
        name: 'Bang Said The Gun',
        eventSeriesType: 'Occasional',
        occurrence: 'Third Thursday of each month',
        summary: 'A poetry riot',
        image: 'abcd1234abcd1234abcd1234abcd1234',
        imageCopyright: 'Foo',
        imageRatio: 1.2,
      });
    });
  });

  describe('mapDbItemToPublicResponse', () => {
    it('should map a fully populated event series', () => {
      const dbItem = testData.createFullDbEventSeries();

      const result = mappings.mapDbItemToPublicResponse(dbItem);

      expect(result).to.eql({
        entityType: 'event-series',
        id: testData.EVENT_SERIES_ID,
        status: 'Active',
        name: 'Bang Said The Gun',
        eventSeriesType: 'Occasional',
        occurrence: 'Third Thursday of each month',
        summary: 'A poetry riot',
        image: 'abcd1234abcd1234abcd1234abcd1234',
        imageCopyright: 'Foo',
        imageRatio: 1.2,
        description: 'Poetry for people who dont like poetry.',
        descriptionCredit: 'Some description credit',
        links: [{ type: 'Wikipedia', url: 'https://en.wikipedia.org/foo' }],
        images: [
          {
            id: 'abcd1234abcd1234abcd1234abcd1234',
            ratio: 1.2,
            copyright: 'Foo',
          },
        ],
        weSay: 'something',
      });
    });
  });

  describe('mapDbItemToFullSearchIndex', () => {
    it('should map a fully populated event series', () => {
      const dbItem = testData.createFullDbEventSeries();

      const result = mappings.mapDbItemToFullSearchIndex(dbItem);

      expect(result).to.eql({
        entityType: 'event-series',
        status: 'Active',
        id: testData.EVENT_SERIES_ID,
        name: 'Bang Said The Gun',
        eventSeriesType: 'Occasional',
        occurrence: 'Third Thursday of each month',
        summary: 'A poetry riot',
        image: 'abcd1234abcd1234abcd1234abcd1234',
        imageCopyright: 'Foo',
        imageRatio: 1.2,
        name_sort: 'bang said the gun',
        version: 1,
      });
    });
  });

  describe('mapDbItemToAutocompleteSearchIndex', () => {
    it('should map a fully populated event series', () => {
      const dbItem = testData.createFullDbEventSeries();

      const result = mappings.mapDbItemToAutocompleteSearchIndex(dbItem);

      expect(result).to.eql({
        nameSuggest: ['bang said the gun'],
        output: 'Bang Said The Gun (Event Series)',
        id: testData.EVENT_SERIES_ID,
        status: 'Active',
        entityType: 'event-series',
        version: 1,
      });
    });
  });
});
