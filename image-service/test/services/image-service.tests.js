'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const constants = require('../../lib/constants');
const imageProcessor = require('../../lib/image/image-processor');
const imageService = require('../../lib/services/image-service');
const imageRepository = require('../../lib/persistence/image-repository');
const entityIterationService = require('../../lib/services/entity-iteration-service');

process.env.SERVERLESS_REPROCESS_IMAGES_TOPIC_ARN = 'ReprocessImagesTopicArn';

describe('image-service', () => {
  describe('startReprocessingImages', () => {
    afterEach(() => {
      entityIterationService.startIteration.restore &&
        entityIterationService.startIteration.restore();
    });

    it('should handle a valid request', done => {
      sinon
        .stub(entityIterationService, 'startIteration')
        .callsFake(actionId => {
          expect(actionId).to.eql(constants.ITERATE_IMAGES_ACTION_ID);
          return Promise.resolve();
        });

      imageService.startReprocessingImages().then(() => done()).catch(done);
    });
  });

  describe('reprocessNextImage', () => {
    afterEach(() => {
      imageRepository.getNextImage.restore &&
        imageRepository.getNextImage.restore();

      imageProcessor.reprocessImage.restore &&
        imageProcessor.reprocessImage.restore();

      entityIterationService.addIterationError.restore &&
        entityIterationService.addIterationError.restore();

      entityIterationService.throttleIteration.restore &&
        entityIterationService.throttleIteration.restore();

      entityIterationService.invokeNextIteration.restore &&
        entityIterationService.invokeNextIteration.restore();
    });

    it('should handle processing an image and continuing the iteration', done => {
      sinon.stub(imageRepository, 'getNextImage').callsFake(lastId => {
        expect(lastId).to.eql('image-1');

        return Promise.resolve({ id: 'image-2' });
      });

      sinon.stub(imageProcessor, 'reprocessImage').callsFake(imageId => {
        expect(imageId).to.eql('image-2');
        return Promise.resolve();
      });

      sinon
        .stub(entityIterationService, 'throttleIteration')
        .callsFake(() => Promise.resolve());

      sinon
        .stub(entityIterationService, 'invokeNextIteration')
        .callsFake((lastId, startTimestamp, actionId, topicArn) => {
          expect(lastId).to.eql('image-2');
          expect(startTimestamp).to.eql(12345678);
          expect(actionId).to.eql(constants.ITERATE_IMAGES_ACTION_ID);
          expect(topicArn).to.eql('ReprocessImagesTopicArn');

          return Promise.resolve();
        });

      imageService
        .reprocessNextImage('image-1', 12345678)
        .then(() => done())
        .catch(done);
    });

    it('should handle an error when processing an image', done => {
      sinon
        .stub(imageRepository, 'getNextImage')
        .callsFake(() => Promise.resolve({ id: 'image-2' }));

      sinon
        .stub(imageProcessor, 'reprocessImage')
        .callsFake(() => Promise.reject(new Error('deliberately thrown')));

      sinon
        .stub(entityIterationService, 'addIterationError')
        .callsFake((message, actionId, startTimestamp, imageId) => {
          expect(message).to.eql('deliberately thrown');
          expect(actionId).to.eql(constants.ITERATE_IMAGES_ACTION_ID);
          expect(startTimestamp).to.eql(12345678);
          expect(imageId).to.eql('image-2');

          return Promise.resolve();
        });

      sinon
        .stub(entityIterationService, 'throttleIteration')
        .callsFake(() => Promise.resolve());

      sinon
        .stub(entityIterationService, 'invokeNextIteration')
        .callsFake((lastId, startTimestamp, actionId, topicArn) => {
          expect(lastId).to.eql('image-2');
          expect(startTimestamp).to.eql(12345678);
          expect(actionId).to.eql(constants.ITERATE_IMAGES_ACTION_ID);
          expect(topicArn).to.eql('ReprocessImagesTopicArn');

          return Promise.resolve();
        });

      imageService
        .reprocessNextImage('image-1', 12345678)
        .then(() => done())
        .catch(done);
    });

    it('should handle reaching the end of the iteration', done => {
      sinon.stub(imageRepository, 'getNextImage').callsFake(lastId => {
        expect(lastId).to.eql('image-99');
        return Promise.resolve(null);
      });

      sinon
        .stub(entityIterationService, 'invokeNextIteration')
        .callsFake((lastId, startTimestamp, actionId, topicArn) => {
          expect(lastId).to.eql(null);
          expect(startTimestamp).to.eql(12345678);
          expect(actionId).to.eql(constants.ITERATE_IMAGES_ACTION_ID);
          expect(topicArn).to.eql('ReprocessImagesTopicArn');

          return Promise.resolve();
        });

      imageService
        .reprocessNextImage('image-99', 12345678)
        .then(() => done())
        .catch(done);
    });
  });

  describe('getImageData', () => {
    afterEach(() => {
      imageRepository.getImage.restore && imageRepository.getImage.restore();
    });

    it('should handle a valid request', done => {
      sinon.stub(imageRepository, 'getImage').callsFake(imageId => {
        expect(imageId).to.eql('1234');
        return Promise.resolve({
          imageType: 'event',
          id: '1234',
          mimeType: 'file/png',
          sourceUrl: 'http://test.com/foo.png',
          width: 100,
          height: 200,
          dominantColor: 'FFFFFF',
          resizeVersion: 4,
          modifiedDate: '2016-10-20',
        });
      });

      imageService
        .getImageData('1234')
        .then(result => {
          expect(result).to.eql({
            imageType: 'event',
            id: '1234',
            mimeType: 'file/png',
            sourceUrl: 'http://test.com/foo.png',
            width: 100,
            height: 200,
            ratio: 2,
            dominantColor: 'FFFFFF',
            resizeVersion: 4,
            modifiedDate: '2016-10-20',
          });

          done();
        })
        .catch(done);
    });
  });

  describe('addImageToStore', () => {
    afterEach(() => {
      imageProcessor.processImage.restore &&
        imageProcessor.processImage.restore();
    });

    it('should handle a valid request', done => {
      sinon.stub(imageProcessor, 'processImage').callsFake((type, id, url) => {
        expect(type).to.eql('event');
        expect(id).to.eql('4330825a3d7511e7a91992ebcb67fe33');
        expect(url).to.eql('http://test.com/foo.png');
        return Promise.resolve();
      });

      const request = {
        type: 'event',
        id: '4330825a-3d75-11e7-a919-92ebcb67fe33',
        url: 'http://test.com/foo.png',
      };

      imageService.addImageToStore(request).then(() => done()).catch(done);
    });

    it('should handle an invalid request', done => {
      sinon.stub(imageProcessor, 'processImage').callsFake((type, id, url) => {
        expect(type).to.eql('event');
        expect(id).to.eql('4330825a3d7511e7a91992ebcb67fe33');
        expect(url).to.eql('http://test.com/foo.png');
        return Promise.resolve();
      });

      const request = {
        type: 'event',
        id: 'not a uuid',
        url: 'http://test.com/foo.png',
      };

      imageService
        .addImageToStore(request)
        .then(() => done(new Error('should have thrown an error')))
        .catch(err => {
          done(
            err.message === '[400] Bad Request: Id is not a UUID'
              ? null
              : new Error('wrong error message: ' + err.message)
          );
        });
    });
  });
});
