import * as service from "../utils/service";
import * as elasticsearch from "../utils/elasticsearch";
import * as testData from "./test-data";
import * as searchTemplateType from "../../src/searcher/search-template-type";
import * as searchIndexType from "../../src/searcher/search-index-type";
import * as searchPresetType from "../../src/search-preset-type";
import * as entityType from "../../src/entity-type";
jest.setTimeout(60000);

beforeAll(async () => {
  await elasticsearch.createTemplate(searchTemplateType.EVENT_ADVANCED);
  await elasticsearch.createTemplate(searchTemplateType.SITEMAP_EVENT_IDS);

  await elasticsearch.createIndex(searchIndexType.TALENT);
  await elasticsearch.createIndex(searchIndexType.VENUE);
  await elasticsearch.createIndex(searchIndexType.EVENT);
  await elasticsearch.createIndex(searchIndexType.EVENT_SERIES);

  await elasticsearch.indexDocument(
    searchIndexType.TALENT,
    testData.TALENT_ACTIVE_CARRIE_CRACKNELL
  );

  await elasticsearch.indexDocument(
    searchIndexType.TALENT,
    testData.TALENT_ACTIVE_DAVE_DONNELLY
  );

  await elasticsearch.indexDocument(
    searchIndexType.VENUE,
    testData.VENUE_ACTIVE_ALMEIDA_THEATRE
  );

  await elasticsearch.indexDocument(
    searchIndexType.VENUE,
    testData.VENUE_DELETED_ARCOLA_THEATRE
  );

  await elasticsearch.indexDocument(
    searchIndexType.EVENT_SERIES,
    testData.EVENT_SERIES_ACTIVE_BANG_SAID_THE_GUN
  );

  await elasticsearch.indexDocument(
    searchIndexType.EVENT,
    testData.EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION
  );

  await elasticsearch.indexDocument(
    searchIndexType.EVENT,
    testData.EVENT_ACTIVE_BRITISH_MUSEUM_PERM_COLL
  );
});

afterAll(async () => {
  await elasticsearch.deleteIndex(searchIndexType.TALENT);
  await elasticsearch.deleteIndex(searchIndexType.VENUE);
  await elasticsearch.deleteIndex(searchIndexType.EVENT);
  await elasticsearch.deleteIndex(searchIndexType.EVENT_SERIES);
});

it("should perform an entity count preset search", async () => {
  const result = await service.get(
    `/public/search/preset/${searchPresetType.ENTITY_COUNTS}`
  );

  expect(result).toEqual({
    items: [
      { count: 2, entityType: entityType.EVENT },
      { count: 1, entityType: entityType.EVENT_SERIES },
      { count: 2, entityType: entityType.TALENT },
      { count: 2, entityType: entityType.VENUE }
    ],
    params: { name: searchPresetType.ENTITY_COUNTS }
  });
});

it("should perform a sitemap event ids preset search", async () => {
  const result = await service.get(
    `/public/search/preset/${searchPresetType.SITEMAP_EVENT_IDS}`
  );

  expect(result).toEqual({
    items: [
      { id: testData.EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION.id },
      { id: testData.EVENT_ACTIVE_BRITISH_MUSEUM_PERM_COLL.id }
    ],
    total: 2,
    params: { name: searchPresetType.SITEMAP_EVENT_IDS }
  });
});

it("should perform a featured events preset search", async () => {
  const result = await service.get(
    `/public/search/preset/${searchPresetType.FEATURED_EVENTS}`
  );

  expect(result).toEqual({
    items: [],
    total: 0,
    params: { name: searchPresetType.FEATURED_EVENTS }
  });
});

it("should perform a venue related events preset search", async () => {
  const result = await service.get(
    `/public/search/preset/${searchPresetType.VENUE_RELATED_EVENTS}?id=${
      testData.VENUE_ACTIVE_ALMEIDA_THEATRE.id
    }`
  );

  expect(result).toEqual({
    items: [testData.EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION],
    total: 1,
    params: {
      name: searchPresetType.VENUE_RELATED_EVENTS,
      id: testData.VENUE_ACTIVE_ALMEIDA_THEATRE.id
    }
  });
});
