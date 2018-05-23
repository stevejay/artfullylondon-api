'use strict';

const path = require('path');
const expect = require('chai').expect;
const imageReader = require('../../lib/image/image-reader');

describe('image-reader', () => {
  describe('getImageFeatures', () => {
    it('should throw an error when reading a non-image file', done => {
      imageReader
        .getImageFeatures(
          path.resolve(__dirname, '../images/not-an-image.json')
        )
        .then(() => done(new Error('should have thrown an error')))
        .catch(() => done());
    });

    it('should handle getting the image features of a jpg image', done => {
      imageReader
        .getImageFeatures(path.resolve(__dirname, '../images/test.jpg'))
        .then(features => {
          expect(features).toEqual({
            mimeType: 'image/jpeg',
            width: 1000,
            height: 667,
            dominantColor: '1e1511',
          });

          done();
        })
        .catch(done);
    });

    it('should handle getting the image features of a webp image', done => {
      imageReader
        .getImageFeatures(path.resolve(__dirname, '../images/notflix.webp'))
        .then(features => {
          expect(features).toEqual({
            mimeType: 'image/webp',
            width: 900,
            height: 573,
            dominantColor: '861915',
          });

          done();
        })
        .catch(done);
    });

    it('should handle getting the image features of a png', done => {
      imageReader
        .getImageFeatures(path.resolve(__dirname, '../images/red.png'))
        .then(features => {
          expect(features).toEqual({
            mimeType: 'image/png',
            width: 2000,
            height: 1200,
            dominantColor: 'dd0000',
          });

          done();
        })
        .catch(done);
    });

    it('should handle getting the image features of a png with no extension', done => {
      imageReader
        .getImageFeatures(path.resolve(__dirname, '../images/red'))
        .then(features => {
          expect(features).toEqual({
            mimeType: 'image/png',
            width: 2000,
            height: 1200,
            dominantColor: 'dd0000',
          });

          done();
        })
        .catch(done);
    });
  });

  describe('getExtensionFromUrl', () => {
    const tests = [
      {
        it: 'should get a png extension',
        arg: 'http://test.com/dir/foo.png',
        expected: '.png',
      },
      {
        it: 'should get a png extension when there is an intermediate extension',
        arg: 'http://test.com/dir.jpg/foo.png',
        expected: '.png',
      },
      {
        it: 'should handle an uppercase jpg extension',
        arg: 'http://test.com/dir/foo.JPG',
        expected: '.jpg',
      },
      {
        it: 'should default to returning a jpg extension if there is no extension',
        arg: 'http://test.com/dir/foo',
        expected: '.jpg',
      },
      {
        it: 'should ignore a querystring',
        arg: 'http://test.com/dir/foo.png?bar=bat',
        expected: '.png',
      },
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = imageReader.getExtensionFromUrl(test.arg);
        expect(actual).toEqual(test.expected);
      });
    });
  });
});
