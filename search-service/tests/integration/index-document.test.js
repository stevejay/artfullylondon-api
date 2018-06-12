import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/search-index-type";
import * as entityType from "../../src/types/entity-type";
import * as testData from "./test-data";
import * as sns from "../utils/sns";
jest.setTimeout(60000);

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
  await sns.send("IndexDocument", {
    entityType: entityType.TALENT,
    entity: testData.TALENT_ACTIVE_CARRIE_CRACKNELL
  });

  const talent = await elasticsearch.getDocumentWithRetry(
    searchIndexType.TALENT,
    testData.TALENT_ACTIVE_CARRIE_CRACKNELL.id
  );

  expect(talent).toEqual(
    expect.objectContaining({
      _index: searchIndexType.TALENT,
      _type: "doc",
      _id: testData.TALENT_ACTIVE_CARRIE_CRACKNELL.id,
      _version: 1,
      _source: expect.objectContaining({
        entityType: entityType.TALENT,
        id: testData.TALENT_ACTIVE_CARRIE_CRACKNELL.id
      })
    })
  );

  const autocomplete = await elasticsearch.getDocumentWithRetry(
    searchIndexType.AUTOCOMPLETE,
    testData.TALENT_ACTIVE_CARRIE_CRACKNELL.id
  );

  expect(autocomplete).toEqual(
    expect.objectContaining({
      _index: searchIndexType.AUTOCOMPLETE,
      _type: "doc",
      _id: testData.TALENT_ACTIVE_CARRIE_CRACKNELL.id,
      _version: 1,
      _source: expect.objectContaining({
        entityType: entityType.TALENT,
        id: testData.TALENT_ACTIVE_CARRIE_CRACKNELL.id
      })
    })
  );
});
