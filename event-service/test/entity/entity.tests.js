'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const entity = require('../../lib/entity/entity');

describe('entity', () => {
  describe('isPublicRequest', () => {
    const tests = [
      {
        it: 'should handle admin path',
        arg: { resource: '/admin/foo' },
        expected: false,
      },
      {
        it: 'should handle public path',
        arg: { resource: '/public/foo' },
        expected: true,
      },
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = entity.isPublicRequest(test.arg);
        expect(actual).to.eql(test.expected);
      });
    });
  });

  describe('get', () => {
    afterEach(() => {
      dynamoDbClient.get.restore();
    });

    it('should return the entity', done => {
      sinon.stub(dynamoDbClient, 'get').callsFake(params => {
        expect(params).to.eql({
          TableName: 'some-table',
          Key: { id: 'some-id' },
          ConsistentRead: false,
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve({ id: 'some-id', version: 1 });
      });

      entity
        .get('some-table', 'some-id')
        .then(result => {
          try {
            expect(result).to.eql({ id: 'some-id', version: 1 });
            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(err => done(err));
    });

    it('should return the entity when consistent read is requested', done => {
      sinon.stub(dynamoDbClient, 'get').callsFake(params => {
        expect(params).to.eql({
          TableName: 'some-table',
          Key: { id: 'some-id' },
          ConsistentRead: true,
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve({ id: 'some-id', version: 1 });
      });

      entity
        .get('some-table', 'some-id', true)
        .then(result => {
          try {
            expect(result).to.eql({ id: 'some-id', version: 1 });
            done();
          } catch (err) {
            done(err);
          }
        })
        .catch(err => done(err));
    });
  });

  describe('write', () => {
    afterEach(() => {
      dynamoDbClient.put.restore();
    });

    it('should create the entity when version is 1', done => {
      sinon.stub(dynamoDbClient, 'put').callsFake(params => {
        expect(params).to.eql({
          TableName: 'some-table',
          Item: { id: 'some-id', version: 1 },
          ConditionExpression: 'attribute_not_exists(id)',
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      entity
        .write('some-table', { id: 'some-id', version: 1 })
        .then(() => done())
        .catch(err => done(err));
    });

    it('should update the entity when version is greater than 1', done => {
      sinon.stub(dynamoDbClient, 'put').callsFake(params => {
        expect(params).to.eql({
          TableName: 'some-table',
          Item: { id: 'some-id', version: 2 },
          ConditionExpression: 'attribute_exists(id) and version = :oldVersion',
          ExpressionAttributeValues: { ':oldVersion': 1 },
          ReturnConsumedCapacity: undefined,
        });

        return Promise.resolve();
      });

      entity
        .write('some-table', { id: 'some-id', version: 2 })
        .then(() => done())
        .catch(err => done(err));
    });
  });
});
