import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/types/search-index-type";
import * as entityType from "../../src/types/entity-type";
import * as sns from "../utils/sns";
jest.setTimeout(60000);

const INDEX_DOCUMENT_TOPIC_NAME = "IndexDocument";

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
    status: "Active",
    commonRole: "Director",
    entityType: "talent",
    talentType: "Individual",
    firstNames: "Carrie",
    id: "carrie-cracknell",
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

  const autocompleteId = `talent_${talentToIndex.id}`;
  const autocomplete = await elasticsearch.getDocumentWithRetry(
    searchIndexType.AUTOCOMPLETE,
    autocompleteId
  );

  expect(autocomplete).toEqual(
    expect.objectContaining({
      _index: searchIndexType.AUTOCOMPLETE,
      _type: "doc",
      _id: autocompleteId,
      _version: 2,
      _source: expect.objectContaining({
        entityType: entityType.TALENT,
        id: talentToIndex.id
      })
    })
  );
});
