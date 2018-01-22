'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const imageRepository = require('../../lib/persistence/image-repository');

process.env.SERVERLESS_IMAGE_TABLE_NAME = 'ImageTable';

describe('image-repository', () => {
  describe('saveImage', () => {
    afterEach(() => {
      dynamoDbClient.put.restore && dynamoDbClient.put.restore();
    });

    it('should save a new image', done => {
      sinon.stub(dynamoDbClient, 'put').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
          Item: { id: 'image-1' },
          ConditionExpression: 'attribute_not_exists(id)',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      imageRepository
        .saveImage({ id: 'image-1' }, false)
        .then(() => done())
        .catch(done);
    });

    it('should save an existing image', done => {
      sinon.stub(dynamoDbClient, 'put').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
          Item: { id: 'image-1' },
          ConditionExpression: 'attribute_exists(id)',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      imageRepository
        .saveImage({ id: 'image-1' }, true)
        .then(() => done())
        .catch(done);
    });
  });

  describe('getNextImage', () => {
    afterEach(() => {
      dynamoDbClient.scanBasic.restore && dynamoDbClient.scanBasic.restore();
    });

    it('should get the next image when there is one', done => {
      sinon.stub(dynamoDbClient, 'scanBasic').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
          ExclusiveStartKey: 'image-1',
          Limit: 1,
          ProjectionExpression: 'id',
          ConsistentRead: false,
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve({
          Items: [{ id: 'image-2', path: '/some/path' }],
        });
      });

      imageRepository
        .getNextImage('image-1')
        .then(result => {
          expect(result).to.eql({ id: 'image-2', path: '/some/path' });
          done();
        })
        .catch(done);
    });

    it('should handle getting the next image when there is none', done => {
      sinon.stub(dynamoDbClient, 'scanBasic').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
          ExclusiveStartKey: 'image-1',
          Limit: 1,
          ProjectionExpression: 'id',
          ConsistentRead: false,
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve({
          Items: [],
        });
      });

      imageRepository
        .getNextImage('image-1')
        .then(result => {
          expect(result).to.eql(null);
          done();
        })
        .catch(done);
    });
  });

  describe('getImage', () => {
    afterEach(() => {
      dynamoDbClient.get.restore && dynamoDbClient.get.restore();
    });

    it('should get an image', done => {
      sinon.stub(dynamoDbClient, 'get').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
          Key: { id: 'image-1' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve({ id: 'image-1', path: '/some/path' });
      });

      imageRepository
        .getImage('image-1')
        .then(result => {
          expect(result).to.eql({ id: 'image-1', path: '/some/path' });
          done();
        })
        .catch(done);
    });

    it('should handle an error when getting an image', done => {
      sinon
        .stub(dynamoDbClient, 'get')
        .callsFake(() => Promise.reject(new Error('deliberately thrown')));

      imageRepository
        .getImage('image-1')
        .then(() => done(new Error('an error should have been thrown')))
        .catch(err => {
          done(
            err.message === 'deliberately thrown'
              ? null
              : new Error('wrong error message')
          );
        });
    });
  });

  describe('tryGetImage', () => {
    afterEach(() => {
      dynamoDbClient.tryGet.restore && dynamoDbClient.tryGet.restore();
    });

    it('should get an image', done => {
      sinon.stub(dynamoDbClient, 'tryGet').callsFake(param => {
        expect(param).to.eql({
          TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
          Key: { id: 'image-1' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve({ id: 'image-1', path: '/some/path' });
      });

      imageRepository
        .tryGetImage('image-1')
        .then(result => {
          expect(result).to.eql({ id: 'image-1', path: '/some/path' });
          done();
        })
        .catch(done);
    });

    it('should handle not finding an image', done => {
      sinon
        .stub(dynamoDbClient, 'tryGet')
        .callsFake(() => Promise.resolve(null));

      imageRepository
        .tryGetImage('image-1')
        .then(result => {
          expect(result).to.eql(null);
          done();
        })
        .catch(done);
    });
  });
});
