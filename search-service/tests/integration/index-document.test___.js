import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/types/search-index-type";
import * as entityType from "../../src/types/entity-type";
import * as statusType from "../../src/types/status-type";
import * as talentType from "../../src/types/talent-type";
import * as sns from "../utils/sns";
jest.setTimeout(60000);

const INDEX_DOCUMENT_TOPIC_NAME = "IndexDocument";

describe("index document", () => {
  beforeAll(async () => {
    await elasticsearch.createIndex(searchIndexType.TALENT);
    await elasticsearch.createIndex(searchIndexType.VENUE);
    await elasticsearch.createIndex(searchIndexType.EVENT);
    await elasticsearch.createIndex(searchIndexType.EVENT_SERIES);
    await elasticsearch.createIndex(searchIndexType.AUTOCOMPLETE);
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex(searchIndexType.TALENT);
    await elasticsearch.deleteIndex(searchIndexType.VENUE);
    await elasticsearch.deleteIndex(searchIndexType.EVENT);
    await elasticsearch.deleteIndex(searchIndexType.EVENT_SERIES);
    await elasticsearch.deleteIndex(searchIndexType.AUTOCOMPLETE);
  });

  it("should index a talent", async () => {
    const talentToIndex = {
      status: statusType.ACTIVE,
      commonRole: "Director",
      entityType: entityType.TALENT,
      talentType: talentType.INDIVIDUAL,
      firstNames: "Carrie",
      id: "talent/carrie-cracknell",
      lastName: "Cracknell",
      version: 2
    };

    await sns.send(INDEX_DOCUMENT_TOPIC_NAME, {
      entityType: entityType.TALENT,
      entity: talentToIndex
    });

    const talent = await elasticsearch.getDocumentWithRetry(
      searchIndexType.TALENT,
      talentToIndex.id
    );

    expect(talent).toEqual(
      expect.objectContaining({
        _index: searchIndexType.TALENT,
        _type: "doc",
        _id: talentToIndex.id,
        _version: 2,
        _source: expect.objectContaining({
          entityType: entityType.TALENT,
          id: talentToIndex.id
        })
      })
    );

    const autocomplete = await elasticsearch.getDocumentWithRetry(
      searchIndexType.AUTOCOMPLETE,
      talentToIndex.id
    );

    expect(autocomplete).toEqual(
      expect.objectContaining({
        _index: searchIndexType.AUTOCOMPLETE,
        _type: "doc",
        _id: talentToIndex.id,
        _version: 2,
        _source: expect.objectContaining({
          entityType: entityType.TALENT,
          id: talentToIndex.id
        })
      })
    );
  });
});
