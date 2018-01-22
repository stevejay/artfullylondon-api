'use strict';

const path = require('path');
// const expect = require('chai').expect;
const imageResizer = require('../../lib/image/image-resizer');

describe('image-resizer', () => {
  describe('resize', () => {
    it('should resize the cracknell jpg image', done => {
      imageResizer
        .resize(
          path.resolve(__dirname, '../images/test.jpg'),
          path.resolve(__dirname, '../images/test.result.jpg'),
          500,
          500
        )
        .then(() => done())
        .catch(done);
    });

    it('should resize the red png image', done => {
      imageResizer
        .resize(
          path.resolve(__dirname, '../images/red.png'),
          path.resolve(__dirname, '../images/test.result.jpg'),
          500,
          500
        )
        .then(() => done())
        .catch(done);
    });

    it('should resize the notflix webp image', done => {
      imageResizer
        .resize(
          path.resolve(__dirname, '../images/notflix.webp'),
          path.resolve(__dirname, '../images/test.result.jpg'),
          500,
          500
        )
        .then(() => done())
        .catch(done);
    });
  });
});
