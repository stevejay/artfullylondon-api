"use strict";

const testData = require("../test-data");
const talentService = require("./talent-service");
const talentConstants = require("./constants");
const entity = require("../entity/entity");
const elasticsearch = require("../external-services/elasticsearch");
const dynamodb = require("../external-services/dynamodb");
const etag = require("../lambda/etag");
const globalConstants = require("../constants");
const date = require("../date");

process.env.SERVERLESS_TALENT_TABLE_NAME = "talent-table";

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("createOrUpdateTalent", () => {
  beforeEach(() => {
    date.getTodayAsStringDate = jest.fn().mockReturnValue("2016/01/11");
  });

  it("should throw when request is invalid", async () => {
    expect(
      await sync(talentService.createOrUpdateTalent(null, { status: "Foo" }))
    ).toThrow();
  });

  it("should process create talent request", async () => {
    elasticsearch.bulk = jest.fn().mockResolvedValue();
    entity.write = jest.fn().mockResolvedValue();
    etag.writeETagToRedis = jest.fn().mockResolvedValue();

    const response = await talentService.createOrUpdateTalent(null, {
      firstNames: "Carrie",
      lastName: "Cracknell",
      status: "Active",
      talentType: "Individual",
      commonRole: "Actor",
      description: "An Actor",
      version: 1,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });

    expect(response).toEqual({
      id: testData.INDIVIDUAL_TALENT_ID,
      firstNames: "Carrie",
      lastName: "Cracknell",
      status: "Active",
      talentType: "Individual",
      commonRole: "Actor",
      description: "An Actor",
      version: 1,
      schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
            _type: "doc",
            _id: testData.INDIVIDUAL_TALENT_ID,
            _version: 1,
            _version_type: "external_gte"
          }
        },
        {
          entityType: "talent",
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: "Carrie",
          lastName: "Cracknell",
          lastName_sort: "cracknell",
          status: "Active",
          talentType: "Individual",
          commonRole: "Actor",
          version: 1
        },
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
            _type: "doc",
            _id: testData.INDIVIDUAL_TALENT_ID,
            _version: 1,
            _version_type: "external_gte"
          }
        },
        {
          nameSuggest: ["carrie cracknell", "cracknell"],
          output: "Carrie Cracknell",
          id: testData.INDIVIDUAL_TALENT_ID,
          status: "Active",
          talentType: "Individual",
          commonRole: "Actor",
          entityType: "talent",
          version: 1
        }
      ]
    });

    expect(entity.write).toHaveBeenCalledWith(
      process.env.SERVERLESS_TALENT_TABLE_NAME,
      {
        id: testData.INDIVIDUAL_TALENT_ID,
        firstNames: "Carrie",
        lastName: "Cracknell",
        status: "Active",
        talentType: "Individual",
        commonRole: "Actor",
        description: "An Actor",
        version: 1,
        schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      }
    );

    expect(etag.writeETagToRedis).toHaveBeenCalled();
  });

  it("should process update talent request", async () => {
    elasticsearch.bulk = jest.fn().mockResolvedValue();
    entity.write = jest.fn().mockResolvedValue();
    etag.writeETagToRedis = jest.fn().mockResolvedValue();

    const response = await talentService.createOrUpdateTalent(
      testData.INDIVIDUAL_TALENT_ID,
      {
        firstNames: "Carrie",
        lastName: "Cracknell",
        status: "Active",
        talentType: "Individual",
        commonRole: "Actor",
        description: "An Actor",
        version: 4,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      }
    );

    expect(response).toEqual({
      id: testData.INDIVIDUAL_TALENT_ID,
      firstNames: "Carrie",
      lastName: "Cracknell",
      status: "Active",
      talentType: "Individual",
      commonRole: "Actor",
      description: "An Actor",
      version: 4,
      schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
            _type: "doc",
            _id: testData.INDIVIDUAL_TALENT_ID,
            _version: 4,
            _version_type: "external_gte"
          }
        },
        {
          entityType: "talent",
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: "Carrie",
          lastName: "Cracknell",
          lastName_sort: "cracknell",
          status: "Active",
          talentType: "Individual",
          commonRole: "Actor",
          version: 4
        },
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
            _type: "doc",
            _id: testData.INDIVIDUAL_TALENT_ID,
            _version: 4,
            _version_type: "external_gte"
          }
        },
        {
          nameSuggest: ["carrie cracknell", "cracknell"],
          output: "Carrie Cracknell",
          id: testData.INDIVIDUAL_TALENT_ID,
          status: "Active",
          talentType: "Individual",
          commonRole: "Actor",
          entityType: "talent",
          version: 4
        }
      ]
    });

    expect(entity.write).toHaveBeenCalledWith(
      process.env.SERVERLESS_TALENT_TABLE_NAME,
      {
        id: testData.INDIVIDUAL_TALENT_ID,
        firstNames: "Carrie",
        lastName: "Cracknell",
        status: "Active",
        talentType: "Individual",
        commonRole: "Actor",
        description: "An Actor",
        version: 4,
        schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      }
    );

    expect(etag.writeETagToRedis).toHaveBeenCalled();
  });

  it("should process update talent request for deleted talent", async () => {
    elasticsearch.bulk = jest.fn().mockResolvedValue();
    entity.write = jest.fn().mockResolvedValue();
    etag.writeETagToRedis = jest.fn().mockResolvedValue();

    const response = await talentService.createOrUpdateTalent(
      testData.INDIVIDUAL_TALENT_ID,
      {
        firstNames: "Carrie",
        lastName: "Cracknell",
        status: "Deleted",
        talentType: "Individual",
        commonRole: "Actor",
        description: "An Actor",
        version: 4,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      }
    );

    expect(response).toEqual({
      id: testData.INDIVIDUAL_TALENT_ID,
      firstNames: "Carrie",
      lastName: "Cracknell",
      status: "Deleted",
      talentType: "Individual",
      commonRole: "Actor",
      description: "An Actor",
      version: 4,
      schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
            _type: "doc",
            _id: testData.INDIVIDUAL_TALENT_ID,
            _version: 4,
            _version_type: "external_gte"
          }
        },
        {
          entityType: "talent",
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: "Carrie",
          lastName: "Cracknell",
          lastName_sort: "cracknell",
          status: "Deleted",
          talentType: "Individual",
          commonRole: "Actor",
          version: 4
        },
        {
          delete: {
            _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
            _type: "doc",
            _id: testData.INDIVIDUAL_TALENT_ID
          }
        }
      ]
    });

    expect(entity.write).toHaveBeenCalledWith(
      process.env.SERVERLESS_TALENT_TABLE_NAME,
      {
        id: testData.INDIVIDUAL_TALENT_ID,
        firstNames: "Carrie",
        lastName: "Cracknell",
        status: "Deleted",
        talentType: "Individual",
        commonRole: "Actor",
        description: "An Actor",
        version: 4,
        schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      }
    );

    expect(etag.writeETagToRedis).toHaveBeenCalled();
  });
});

describe("getTalentForEdit", () => {
  it("should process request", async () => {
    const dbItem = testData.createMinimalIndividualDbTalent();
    entity.get = jest.fn().mockResolvedValue(dbItem);

    const response = await talentService.getTalentForEdit(
      testData.INDIVIDUAL_TALENT_ID
    );

    expect(response).toEqual({
      id: testData.INDIVIDUAL_TALENT_ID,
      status: "Active",
      lastName: "Cracknell",
      talentType: "Individual",
      commonRole: "Actor",
      firstNames: "Carrie",
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11",
      schemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
      version: 3
    });

    expect(entity.get).toHaveBeenCalledWith(
      process.env.SERVERLESS_TALENT_TABLE_NAME,
      testData.INDIVIDUAL_TALENT_ID,
      true
    );
  });
});

describe("getTalentMulti", () => {
  it("should process a get multiple request", async () => {
    dynamodb.batchGet = jest.fn().mockResolvedValue({
      Responses: {
        [process.env.SERVERLESS_TALENT_TABLE_NAME]: [
          {
            id: "carrie-cracknell-director"
          },
          {
            id: "philipe-parreno-artist"
          }
        ]
      }
    });

    const response = await talentService.getTalentMulti([
      "carrie-cracknell-director",
      "philipe-parreno-artist"
    ]);

    expect(response).toEqual(
      expect.arrayContaining([
        {
          entityType: "talent",
          id: "carrie-cracknell-director"
        },
        {
          entityType: "talent",
          id: "philipe-parreno-artist"
        }
      ])
    );

    expect(dynamodb.batchGet).toHaveBeenCalled();
  });
});

describe("getTalent", () => {
  it("should process a get talent request", async () => {
    const dbItem = testData.createMinimalIndividualDbTalent();
    entity.get = jest.fn().mockResolvedValue(dbItem);

    const response = await talentService.getTalent(
      testData.INDIVIDUAL_TALENT_ID,
      true
    );

    expect(response).toEqual({
      entityType: "talent",
      isFullEntity: true,
      id: testData.INDIVIDUAL_TALENT_ID,
      status: "Active",
      lastName: "Cracknell",
      talentType: "Individual",
      commonRole: "Actor",
      firstNames: "Carrie"
    });

    expect(entity.get).toHaveBeenCalledWith(
      process.env.SERVERLESS_TALENT_TABLE_NAME,
      testData.INDIVIDUAL_TALENT_ID,
      false
    );
  });
});
