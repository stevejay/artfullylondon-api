'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const reprocessImages = require('../../handlers/reprocess-images-sns');
const imageService = require('../../lib/services/image-service');

describe('reprocess-images-sns.handler', () => {
  afterEach(() => {
    imageService.reprocessNextImage.restore &&
      imageService.reprocessNextImage.restore();
  });

  it('should handle a notification to reprocess the next image', done => {
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify({
              lastId: '1234',
              startTimestamp: 12345678,
              retry: 0,
            }),
          },
        },
      ],
    };

    sinon
      .stub(imageService, 'reprocessNextImage')
      .callsFake((lastId, startTimestamp, startTime) => {
        expect(lastId).toEqual('1234');
        expect(startTimestamp).toEqual(12345678);
        expect(startTime).to.not.eql(null);
        return Promise.resolve();
      });

    reprocessImages.handler(event, null, (err, result) => {
      if (err) {
        done(err);
      } else {
        expect(result).toEqual({ acknowledged: true });
        done();
      }
    });
  });

  it('should handle an error occurring when reprocessing the next image', done => {
    const event = {
      Records: [
        {
          Sns: {
            Message: JSON.stringify({
              lastId: '1234',
              startTimestamp: 12345678,
              retry: 0,
            }),
          },
        },
      ],
    };

    sinon
      .stub(imageService, 'reprocessNextImage')
      .callsFake(() => Promise.reject(new Error('deliberately thrown')));

    reprocessImages.handler(event, null, err => {
      if (err) {
        done(
          err.message === 'deliberately thrown'
            ? null
            : new Error('wrong error message')
        );
      } else {
        done(new Error('should have thrown an exception'));
      }
    });
  });

  it('should handle an empty notification', done => {
    const event = {
      Records: [
        {
          Sns: {
            Message: null,
          },
        },
      ],
    };

    reprocessImages.handler(event, null, (err, result) => {
      if (err) {
        done(err);
      } else {
        expect(result).toEqual({ acknowledged: true });
        done();
      }
    });
  });
});
