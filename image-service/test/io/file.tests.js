'use strict';

const path = require('path');
const file = require('../../lib/io/file');

describe('file', () => {
  describe('downloadFile', () => {
    it('should download a file that exists', done => {
      file
        .downloadFile(
          'https://siteimages.artfully.london/artgallery.png',
          path.resolve(__dirname, '../images/image.result.png')
        )
        .then(() => done())
        .catch(done);
    });

    it('should throw when downloading a file that does not exist', done => {
      file
        .downloadFile(
          'http://alsdfjasfl.asdfasf.com',
          path.resolve(__dirname, '../images/image.result.png')
        )
        .then(() => done(new Error('should have thrown an error')))
        .catch(() => done());
    });
  });
});
