'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-subset'));
const expect = chai.expect;
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const testData = require('../test-data');
const talentService = require('../../lib/services/talent-service');
const talentConstants = require('../../lib/talent/constants');
const elasticsearch = require('../../lib/external-services/elasticsearch');
const etag = require('../../lib/lambda/etag');
const globalConstants = require('../../lib/constants');

process.env.SERVERLESS_TALENT_TABLE_NAME = 'talent-table';

describe('createOrUpdateTalent', () => {
  afterEach(() => {
    if (dynamoDbClient.put.restore) {
      dynamoDbClient.put.restore();
    }
    if (elasticsearch.bulk.restore) {
      elasticsearch.bulk.restore();
    }
    if (etag.writeETagToRedis.restore) {
      etag.writeETagToRedis.restore();
    }
  });

  it('should throw when request is invalid', done => {
    talentService
      .createOrUpdateTalent(null, { status: 'Foo' })
      .then(() => done(new Error('should have thrown an exception')))
      .catch(() => done());
  });

  it('should process create talent request', done => {
    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
              _type: 'default',
              _id: testData.INDIVIDUAL_TALENT_ID,
              _version: 1,
              _version_type: 'external',
            },
          },
          {
            entityType: 'talent',
            id: testData.INDIVIDUAL_TALENT_ID,
            firstNames: 'Carrie',
            lastName: 'Cracknell',
            lastName_sort: 'cracknell',
            status: 'Active',
            talentType: 'Individual',
            commonRole: 'Actor',
            version: 1,
          },
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
              _type: 'default',
              _id: testData.INDIVIDUAL_TALENT_ID,
              _version: 1,
              _version_type: 'external',
            },
          },
          {
            nameSuggest: ['carrie cracknell', 'cracknell'],
            output: 'Carrie Cracknell',
            id: testData.INDIVIDUAL_TALENT_ID,
            status: 'Active',
            talentType: 'Individual',
            commonRole: 'Actor',
            entityType: 'talent',
            version: 1,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'put').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        Item: {
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: 'Carrie',
          lastName: 'Cracknell',
          status: 'Active',
          talentType: 'Individual',
          commonRole: 'Actor',
          description: 'An Actor',
          version: 1,
          schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
          createdDate: '2016/01/10',
          updatedDate: '2016/01/11',
        },
        ConditionExpression: 'attribute_not_exists(id)',
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve();
    });

    sinon.stub(etag, 'writeETagToRedis').callsFake(key => {
      expect(key).to.eql('talent/' + testData.INDIVIDUAL_TALENT_ID);
      return Promise.resolve();
    });

    const expected = {
      id: testData.INDIVIDUAL_TALENT_ID,
      firstNames: 'Carrie',
      lastName: 'Cracknell',
      status: 'Active',
      talentType: 'Individual',
      commonRole: 'Actor',
      description: 'An Actor',
      version: 1,
      schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
    };

    talentService
      .createOrUpdateTalent(null, {
        firstNames: 'Carrie',
        lastName: 'Cracknell',
        status: 'Active',
        talentType: 'Individual',
        commonRole: 'Actor',
        description: 'An Actor',
        version: 1,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
      })
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });

  it('should process update talent request', done => {
    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
              _type: 'default',
              _id: testData.INDIVIDUAL_TALENT_ID,
              _version: 4,
              _version_type: 'external',
            },
          },
          {
            entityType: 'talent',
            id: testData.INDIVIDUAL_TALENT_ID,
            firstNames: 'Carrie',
            lastName: 'Cracknell',
            lastName_sort: 'cracknell',
            status: 'Active',
            talentType: 'Individual',
            commonRole: 'Actor',
            version: 4,
          },
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
              _type: 'default',
              _id: testData.INDIVIDUAL_TALENT_ID,
              _version: 4,
              _version_type: 'external',
            },
          },
          {
            nameSuggest: ['carrie cracknell', 'cracknell'],
            output: 'Carrie Cracknell',
            id: testData.INDIVIDUAL_TALENT_ID,
            status: 'Active',
            talentType: 'Individual',
            commonRole: 'Actor',
            entityType: 'talent',
            version: 4,
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'put').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        Item: {
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: 'Carrie',
          lastName: 'Cracknell',
          status: 'Active',
          talentType: 'Individual',
          commonRole: 'Actor',
          description: 'An Actor',
          version: 4,
          schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
          createdDate: '2016/01/10',
          updatedDate: '2016/01/11',
        },
        ConditionExpression: 'attribute_exists(id) and version = :oldVersion',
        ExpressionAttributeValues: { ':oldVersion': 3 },
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve();
    });

    sinon.stub(etag, 'writeETagToRedis').callsFake(key => {
      expect(key).to.eql('talent/' + testData.INDIVIDUAL_TALENT_ID);
      return Promise.resolve();
    });

    const expected = {
      id: testData.INDIVIDUAL_TALENT_ID,
      firstNames: 'Carrie',
      lastName: 'Cracknell',
      status: 'Active',
      talentType: 'Individual',
      commonRole: 'Actor',
      description: 'An Actor',
      version: 4,
      schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
    };

    talentService
      .createOrUpdateTalent(testData.INDIVIDUAL_TALENT_ID, {
        firstNames: 'Carrie',
        lastName: 'Cracknell',
        status: 'Active',
        talentType: 'Individual',
        commonRole: 'Actor',
        description: 'An Actor',
        version: 4,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
      })
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });

  it('should process update talent request for deleted talent', done => {
    sinon.stub(elasticsearch, 'bulk').callsFake(params => {
      expect(params).to.eql({
        body: [
          {
            index: {
              _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
              _type: 'default',
              _id: testData.INDIVIDUAL_TALENT_ID,
              _version: 4,
              _version_type: 'external',
            },
          },
          {
            entityType: 'talent',
            id: testData.INDIVIDUAL_TALENT_ID,
            firstNames: 'Carrie',
            lastName: 'Cracknell',
            lastName_sort: 'cracknell',
            status: 'Deleted',
            talentType: 'Individual',
            commonRole: 'Actor',
            version: 4,
          },
          {
            delete: {
              _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
              _type: 'default',
              _id: testData.INDIVIDUAL_TALENT_ID,
              _version: 4,
              _version_type: 'external',
            },
          },
        ],
      });

      return Promise.resolve();
    });

    sinon.stub(dynamoDbClient, 'put').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        Item: {
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: 'Carrie',
          lastName: 'Cracknell',
          status: 'Deleted',
          talentType: 'Individual',
          commonRole: 'Actor',
          description: 'An Actor',
          version: 4,
          schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
          createdDate: '2016/01/10',
          updatedDate: '2016/01/11',
        },
        ConditionExpression: 'attribute_exists(id) and version = :oldVersion',
        ExpressionAttributeValues: { ':oldVersion': 3 },
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve();
    });

    sinon.stub(etag, 'writeETagToRedis').callsFake(() => {
      return Promise.resolve();
    });

    const expected = {
      id: testData.INDIVIDUAL_TALENT_ID,
      firstNames: 'Carrie',
      lastName: 'Cracknell',
      status: 'Deleted',
      talentType: 'Individual',
      commonRole: 'Actor',
      description: 'An Actor',
      version: 4,
      schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
    };

    talentService
      .createOrUpdateTalent(testData.INDIVIDUAL_TALENT_ID, {
        firstNames: 'Carrie',
        lastName: 'Cracknell',
        status: 'Deleted',
        talentType: 'Individual',
        commonRole: 'Actor',
        description: 'An Actor',
        version: 4,
        createdDate: '2016/01/10',
        updatedDate: '2016/01/11',
      })
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getTalentForEdit', () => {
  afterEach(() => {
    dynamoDbClient.get.restore();
  });

  it('should process request', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        Key: { id: testData.INDIVIDUAL_TALENT_ID },
        ConsistentRead: true,
        ReturnConsumedCapacity: undefined,
      });

      const dbItem = testData.createMinimalIndividualDbTalent();
      return Promise.resolve(dbItem);
    });

    const expected = {
      id: testData.INDIVIDUAL_TALENT_ID,
      status: 'Active',
      lastName: 'Cracknell',
      talentType: 'Individual',
      commonRole: 'Actor',
      firstNames: 'Carrie',
      createdDate: '2016/01/10',
      updatedDate: '2016/01/11',
      schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
      version: 3,
    };

    talentService
      .getTalentForEdit(testData.INDIVIDUAL_TALENT_ID)
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getTalentMulti', () => {
  afterEach(() => {
    dynamoDbClient.batchGet.restore();
  });

  it('should process a get multiple request', done => {
    sinon.stub(dynamoDbClient, 'batchGet').callsFake(params => {
      expect(
        params.RequestItems[process.env.SERVERLESS_TALENT_TABLE_NAME].Keys
      ).to.eql([
        { id: 'carrie-cracknell-director' },
        { id: 'philipe-parreno-artist' },
      ]);

      return Promise.resolve({
        Responses: {
          [process.env.SERVERLESS_TALENT_TABLE_NAME]: [
            {
              id: 'carrie-cracknell-director',
            },
            {
              id: 'philipe-parreno-artist',
            },
          ],
        },
      });
    });

    const expected = [
      {
        entityType: 'talent',
        id: 'carrie-cracknell-director',
      },
      {
        entityType: 'talent',
        id: 'philipe-parreno-artist',
      },
    ];

    talentService
      .getTalentMulti(['carrie-cracknell-director', 'philipe-parreno-artist'])
      .then(response => expect(response).to.containSubset(expected))
      .then(() => done())
      .catch(done);
  });
});

describe('getTalent', () => {
  afterEach(() => {
    dynamoDbClient.get.restore();
  });

  it('should process an admin get talent request', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        Key: { id: testData.INDIVIDUAL_TALENT_ID },
        ConsistentRead: true,
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve(testData.createMinimalIndividualDbTalent());
    });

    const expected = {
      entityType: 'talent',
      isFullEntity: true,
      id: testData.INDIVIDUAL_TALENT_ID,
      status: 'Active',
      lastName: 'Cracknell',
      talentType: 'Individual',
      commonRole: 'Actor',
      firstNames: 'Carrie',
    };

    talentService
      .getTalent(testData.INDIVIDUAL_TALENT_ID, false)
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });

  it('should process a public get talent request', done => {
    sinon.stub(dynamoDbClient, 'get').callsFake(params => {
      expect(params).to.eql({
        TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        Key: { id: testData.INDIVIDUAL_TALENT_ID },
        ConsistentRead: false,
        ReturnConsumedCapacity: undefined,
      });

      return Promise.resolve(testData.createMinimalIndividualDbTalent());
    });

    const expected = {
      entityType: 'talent',
      isFullEntity: true,
      id: testData.INDIVIDUAL_TALENT_ID,
      status: 'Active',
      lastName: 'Cracknell',
      talentType: 'Individual',
      commonRole: 'Actor',
      firstNames: 'Carrie',
    };

    talentService
      .getTalent(testData.INDIVIDUAL_TALENT_ID, true)
      .then(response => expect(response).to.eql(expected))
      .then(() => done())
      .catch(done);
  });
});
