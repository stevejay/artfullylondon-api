'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const tagRepository = require('../../lib/persistence/tag-repository');

process.env.SERVERLESS_TAG_TABLE_NAME = 'tag-table';

describe('tag-repository', () => {
  describe('saveTag', () => {
    afterEach(() => {
      dynamoDbClient.put.restore && dynamoDbClient.put.restore();
    });

    it('should save a tag', done => {
      sinon.stub(dynamoDbClient, 'put').callsFake(param => {
        expect(param).to.eql({
          TableName: 'tag-table',
          Item: { tagType: 'geo', id: 'geo/usa' },
          ConditionExpression:
            'attribute_not_exists(tagType) and attribute_not_exists(id)',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      tagRepository
        .saveTag({ tagType: 'geo', id: 'geo/usa' })
        .then(() => done())
        .catch(done);
    });
  });

  describe('deleteTag', () => {
    afterEach(() => {
      dynamoDbClient.delete.restore && dynamoDbClient.delete.restore();
    });

    it('should delete a tag', done => {
      sinon.stub(dynamoDbClient, 'delete').callsFake(param => {
        expect(param).to.eql({
          TableName: 'tag-table',
          Key: { tagType: 'geo', id: 'geo/usa' },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      tagRepository.deleteTag('geo', 'geo/usa').then(() => done()).catch(done);
    });
  });

  describe('getAll', () => {
    afterEach(() => {
      dynamoDbClient.scan.restore && dynamoDbClient.scan.restore();
    });

    it('should get all tags', done => {
      sinon.stub(dynamoDbClient, 'scan').callsFake(param => {
        expect(param).to.eql({
          TableName: 'tag-table',
          ProjectionExpression: 'id, label',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve([
          { tagType: 'geo', id: 'geo/usa', label: 'usa' },
        ]);
      });

      tagRepository
        .getAll('geo', 'geo/usa')
        .then(response => {
          expect(response).to.eql([
            { tagType: 'geo', id: 'geo/usa', label: 'usa' },
          ]);

          done();
        })
        .catch(done);
    });
  });

  describe('getAllByTagType', () => {
    afterEach(() => {
      dynamoDbClient.query.restore && dynamoDbClient.query.restore();
    });

    it('should get all tags', done => {
      sinon.stub(dynamoDbClient, 'query').callsFake(param => {
        expect(param).to.eql({
          TableName: 'tag-table',
          KeyConditionExpression: 'tagType = :type',
          ExpressionAttributeValues: { ':type': 'geo' },
          ProjectionExpression: 'id, label',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve([
          { tagType: 'geo', id: 'geo/usa', label: 'usa' },
        ]);
      });

      tagRepository
        .getAllByTagType('geo')
        .then(response => {
          expect(response).to.eql([
            { tagType: 'geo', id: 'geo/usa', label: 'usa' },
          ]);

          done();
        })
        .catch(done);
    });
  });
});
