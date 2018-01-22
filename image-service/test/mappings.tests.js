'use strict';

const expect = require('chai').expect;
const mappings = require('../lib/mappings');

describe('mappings', () => {
  describe('mapRequestToDbItem', () => {
    it('should map a request', () => {
      const request = {
        imageType: 'venue',
        id: 'image-1',
        mimeType: 'image/png',
        sourceUrl: 'http://test.com/image.png',
        width: 500,
        height: 600,
        resizeVersion: 3,
        dominantColor: '440000',
      };

      const result = mappings.mapRequestToDbItem(request);

      expect(result.imageType).eql('venue');
      expect(result.id).eql('image-1');
      expect(result.mimeType).eql('image/png');
      expect(result.sourceUrl).eql('http://test.com/image.png');
      expect(result.width).eql(500);
      expect(result.height).eql(600);
      expect(result.resizeVersion).eql(3);
      expect(result.dominantColor).eql('440000');
      expect(result.modifiedDate).match(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/
      );
    });
  });

  describe('mapDbItemToResponse', () => {
    it('should map an item', () => {
      const item = {
        imageType: 'venue',
        id: 'image-1',
        mimeType: 'image/png',
        sourceUrl: 'http://test.com/image.png',
        width: 500,
        height: 600,
        dominantColor: '440000',
        resizeVersion: 4,
        modifiedDate: '2012-10-06T04:13:00.000Z',
      };

      const result = mappings.mapDbItemToResponse(item);

      expect(result.imageType).eql('venue');
      expect(result.id).eql('image-1');
      expect(result.mimeType).eql('image/png');
      expect(result.sourceUrl).eql('http://test.com/image.png');
      expect(result.width).eql(500);
      expect(result.height).eql(600);
      expect(result.ratio).eql(1.2);
      expect(result.resizeVersion).eql(4);
      expect(result.dominantColor).eql('440000');
      expect(result.modifiedDate).eql('2012-10-06T04:13:00.000Z');
    });

    it('should map an item with no dominantColor value', function() {
      const item = {
        imageType: 'venue',
        id: 'image-1',
        mimeType: 'image/png',
        sourceUrl: 'http://test.com/image.png',
        width: 500,
        height: 600,
        modifiedDate: '2012-10-06T04:13:00.000Z',
      };

      const result = mappings.mapDbItemToResponse(item);

      expect(result.dominantColor).eql(undefined);
      expect(result.resizeVersion).eql(0);
    });
  });
});
