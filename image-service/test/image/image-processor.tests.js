'use strict';

const sinon = require('sinon');
const chai = require('chai');
const chaiSubset = require('chai-subset');
chai.use(chaiSubset);
const expect = require('chai').expect;
const tmp = require('tmp');
const constants = require('../../lib/constants');
const imageRepository = require('../../lib/persistence/image-repository');
const imageProcessor = require('../../lib/image/image-processor');
const imageResizer = require('../../lib/image/image-resizer');
const file = require('../../lib/io/file');
const imageReader = require('../../lib/image/image-reader');
const s3 = require('../../lib/external-services/s3');

process.env.SERVERLESS_ORIGINAL_IMAGES_BUCKET_NAME = 'OriginalImagesBucket';
process.env.SERVERLESS_RESIZED_IMAGES_BUCKET_NAME = 'ResizedImagesBucket';

describe('process-image', () => {
  afterEach(() => {
    imageRepository.tryGetImage.restore &&
      imageRepository.tryGetImage.restore();
    imageRepository.saveImage.restore && imageRepository.saveImage.restore();
    file.downloadFile.restore && file.downloadFile.restore();
    file.readFile.restore && file.readFile.restore();
    file.deleteFile.restore && file.deleteFile.restore();
    tmp.tmpNameSync.restore && tmp.tmpNameSync.restore();
    imageReader.getImageFeatures.restore &&
      imageReader.getImageFeatures.restore();
    s3.putObjectToS3.restore && s3.putObjectToS3.restore();
    s3.getObjectFromS3.restore && s3.getObjectFromS3.restore();
    imageProcessor.resizeImage.restore && imageProcessor.resizeImage.restore();
    imageResizer.resize.restore && imageResizer.resize.restore();
  });

  describe('resizeImage', () => {
    it('should resize an image', done => {
      sinon
        .stub(imageResizer, 'resize')
        .callsFake((filePath, resizedFilePath, width, height) => {
          expect(filePath).toEqual('/tmp/path');
          expect(resizedFilePath).toEqual('/tmp/path.120x180.jpg');
          expect(width).toEqual(120);
          expect(height).toEqual(180);

          return Promise.resolve();
        });

      sinon.stub(file, 'readFile').callsFake(resizedFilePath => {
        expect(resizedFilePath).toEqual('/tmp/path.120x180.jpg');
        return Promise.resolve('The Content');
      });

      sinon.stub(s3, 'putObjectToS3').callsFake(params => {
        expect(params).toEqual({
          Bucket: 'ResizedImagesBucket',
          Key: '11/22/11223344aaaaaaaabbbbbbbbcccccccc/120x180.jpg',
          Body: 'The Content',
          ContentType: 'image/jpeg',
        });

        return Promise.resolve();
      });

      imageProcessor
        .resizeImage(
          [{ width: 120, height: 180, suffix: '120x180' }],
          '11223344aaaaaaaabbbbbbbbcccccccc',
          '/tmp/path'
        )
        .then(() => done())
        .catch(done);
    });
  });

  describe('processImage', () => {
    it('should process a new image', done => {
      sinon.stub(imageRepository, 'tryGetImage').callsFake(id => {
        expect(id).toEqual('11223344aaaaaaaabbbbbbbbcccccccc');
        return Promise.resolve(null);
      });

      sinon.stub(tmp, 'tmpNameSync').callsFake(() => '/tmp/path');

      sinon.stub(file, 'downloadFile').callsFake((imageUrl, tmpPath) => {
        expect(imageUrl).toEqual('http://test.com/foo.png');
        expect(tmpPath).toEqual('/tmp/path');
        return Promise.resolve();
      });

      sinon.stub(imageReader, 'getImageFeatures').callsFake(filePath => {
        expect(filePath).toEqual('/tmp/path');

        return Promise.resolve({
          width: 600,
          height: 1200,
          mimeType: 'image/png',
          dominantColor: '440000',
        });
      });

      sinon.stub(file, 'readFile').callsFake(filePath => {
        expect(filePath).toEqual('/tmp/path');
        return Promise.resolve('The Content');
      });

      sinon.stub(s3, 'putObjectToS3').callsFake(params => {
        expect(params).toEqual({
          Bucket: 'OriginalImagesBucket',
          Key: '11/22/11223344aaaaaaaabbbbbbbbcccccccc.png',
          Body: 'The Content',
          ContentType: 'image/png',
        });

        return Promise.resolve();
      });

      sinon
        .stub(imageProcessor, 'resizeImage')
        .callsFake((resizeSizes, id, filePath) => {
          expect(resizeSizes).toEqual(constants.RESIZE_SIZES);
          expect(id).toEqual('11223344aaaaaaaabbbbbbbbcccccccc');
          expect(filePath).toEqual('/tmp/path');

          return Promise.resolve();
        });

      sinon
        .stub(imageRepository, 'saveImage')
        .callsFake((dbItemToSave, reprocessing) => {
          // TODO dbItemToSave
          expect(reprocessing).toEqual(false);
          return Promise.resolve();
        });

      sinon.stub(file, 'deleteFile').callsFake(() => Promise.resolve());

      imageProcessor
        .processImage(
          'event',
          '11223344aaaaaaaabbbbbbbbcccccccc',
          'http://test.com/foo.png'
        )
        .then(result => {
          expect(result).to.containSubset({
            image: {
              id: '11223344aaaaaaaabbbbbbbbcccccccc',
              sourceUrl: 'http://test.com/foo.png',
              imageType: 'event',
              resizeVersion: constants.CURRENT_IMAGE_RESIZE_VERSION,
              mimeType: 'image/png',
              width: 600,
              height: 1200,
              ratio: 2,
              dominantColor: '440000',
            },
          });

          done();
        })
        .catch(done);
    });

    it('should throw an exception if the image already exists', done => {
      sinon.stub(imageRepository, 'tryGetImage').callsFake(id => {
        expect(id).toEqual('image-1');
        return Promise.resolve({ id: 'image-1' });
      });

      imageProcessor
        .processImage('event', 'image-1', 'http://test.com/foo.png')
        .then(() => done(new Error('should have thrown an exception')))
        .catch(err =>
          done(
            err.message === '[400] Image Already Exists'
              ? null
              : new Error('wrong error message ' + err.message)
          )
        );
    });
  });

  describe('reprocessImage', () => {
    it('should short-circuit when processing an existing image that is at the current resize version', done => {
      sinon.stub(imageRepository, 'tryGetImage').callsFake(id => {
        expect(id).toEqual('11223344aaaaaaaabbbbbbbbcccccccc');

        return Promise.resolve({
          id: '11223344aaaaaaaabbbbbbbbcccccccc',
          sourceUrl: 'http://test.com/foo.png',
          imageType: 'event',
          resizeVersion: constants.CURRENT_IMAGE_RESIZE_VERSION,
          mimeType: 'image/png',
          width: 600,
          height: 1200,
          dominantColor: '440000',
          modifiedDate: '2012-10-06T04:13:00.000Z',
        });
      });

      imageProcessor
        .reprocessImage('11223344aaaaaaaabbbbbbbbcccccccc')
        .then(result => {
          expect(result).toEqual({
            image: {
              id: '11223344aaaaaaaabbbbbbbbcccccccc',
              sourceUrl: 'http://test.com/foo.png',
              imageType: 'event',
              resizeVersion: constants.CURRENT_IMAGE_RESIZE_VERSION,
              mimeType: 'image/png',
              width: 600,
              height: 1200,
              ratio: 2,
              dominantColor: '440000',
              modifiedDate: '2012-10-06T04:13:00.000Z',
            },
          });

          done();
        })
        .catch(done);
    });

    it('should reprocess an existing image', done => {
      sinon.stub(imageRepository, 'tryGetImage').callsFake(id => {
        expect(id).toEqual('11223344aaaaaaaabbbbbbbbcccccccc');

        return Promise.resolve({
          id: '11223344aaaaaaaabbbbbbbbcccccccc',
          sourceUrl: 'http://test.com/foo.png',
          imageType: 'event',
          resizeVersion: constants.CURRENT_IMAGE_RESIZE_VERSION - 1,
          mimeType: 'image/png',
          width: 600,
          height: 1200,
          dominantColor: '440000',
          modifiedDate: '2012-10-06T04:13:00.000Z',
        });
      });

      sinon.stub(tmp, 'tmpNameSync').callsFake(() => '/tmp/path');

      sinon
        .stub(s3, 'getObjectFromS3')
        .callsFake((bucketName, s3Key, filePath) => {
          expect(bucketName).toEqual('OriginalImagesBucket');
          expect(s3Key).toEqual('11/22/11223344aaaaaaaabbbbbbbbcccccccc.png');
          expect(filePath).toEqual('/tmp/path');

          return Promise.resolve();
        });

      sinon.stub(imageReader, 'getImageFeatures').callsFake(filePath => {
        expect(filePath).toEqual('/tmp/path');

        return Promise.resolve({
          width: 600,
          height: 1200,
          mimeType: 'image/png',
          dominantColor: '880000',
        });
      });

      sinon.stub(file, 'readFile').callsFake(filePath => {
        expect(filePath).toEqual('/tmp/path');
        return Promise.resolve('The Content');
      });

      sinon.stub(s3, 'putObjectToS3').callsFake(params => {
        expect(params).toEqual({
          Bucket: 'OriginalImagesBucket',
          Key: '11/22/11223344aaaaaaaabbbbbbbbcccccccc.png',
          Body: 'The Content',
          ContentType: 'image/png',
        });

        return Promise.resolve();
      });

      sinon
        .stub(imageProcessor, 'resizeImage')
        .callsFake((resizeSizes, id, filePath) => {
          expect(resizeSizes).toEqual(constants.RESIZE_SIZES);
          expect(id).toEqual('11223344aaaaaaaabbbbbbbbcccccccc');
          expect(filePath).toEqual('/tmp/path');

          return Promise.resolve();
        });

      sinon
        .stub(imageRepository, 'saveImage')
        .callsFake((dbItemToSave, reprocessing) => {
          // TODO dbItemToSave
          expect(reprocessing).toEqual(true);
          return Promise.resolve();
        });

      sinon.stub(file, 'deleteFile').callsFake(() => Promise.resolve());

      imageProcessor
        .reprocessImage('11223344aaaaaaaabbbbbbbbcccccccc')
        .then(result => {
          expect(result).to.containSubset({
            image: {
              id: '11223344aaaaaaaabbbbbbbbcccccccc',
              sourceUrl: 'http://test.com/foo.png',
              imageType: 'event',
              resizeVersion: constants.CURRENT_IMAGE_RESIZE_VERSION,
              mimeType: 'image/png',
              width: 600,
              height: 1200,
              ratio: 2,
              dominantColor: '880000',
            },
          });

          done();
        })
        .catch(done);
    });

    it('should throw an exception if the image does not already exist', done => {
      sinon.stub(imageRepository, 'tryGetImage').callsFake(id => {
        expect(id).toEqual('image-1');
        return Promise.resolve(null);
      });

      imageProcessor
        .reprocessImage('image-1')
        .then(() => done(new Error('should have thrown an exception')))
        .catch(err =>
          done(
            err.message === '[404] Image Data Not Found'
              ? null
              : new Error('wrong error message ' + err.message)
          )
        );
    });
  });
});
