import * as service from "../utils/service";
import * as elasticsearch from "../utils/elasticsearch";
import * as testData from "./test-data";
import * as searchIndexType from "../../src/types/search-index-type";
import * as presetSearchType from "../../src/types/preset-search-type";
jest.setTimeout(60000);

beforeAll(async () => {
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
    `/search/preset/${presetSearchType.ENTITY_COUNTS}`
  );

  expect(result).toEqual(
    '{body={"items":[{"entityType":"event","count":2},{"entityType":"event-series","count":1},{"entityType":"talent","count":2},{"entityType":"venue","count":2}],"params":{"id":"","name":"entity-counts","isOffline":true,"stageVariables":{}}}, headers={Cache-Control=public, max-age=1800}}'
  );
});

it("should perform a sitemap event ids preset search", async () => {
  const result = await service.get(
    `/search/preset/${presetSearchType.SITEMAP_EVENT_IDS}`
  );

  expect(result).toEqual(
    '{body={"items":[{"id":"andy-warhol-exhibition"},{"id":"british-museum-perm"}],"total":2,"params":{"id":"","name":"sitemap-event-ids","isOffline":true,"stageVariables":{}}}, headers={Cache-Control=public, max-age=1800}}'
  );
});

it("should perform a featured events preset search", async () => {
  const result = await service.get(
    `/search/preset/${presetSearchType.FEATURED_EVENTS}`
  );

  expect(result).toEqual(
    '{body={"items":[],"total":0,"params":{"id":"","name":"featured-events","isOffline":true,"stageVariables":{}}}, headers={Cache-Control=public, max-age=1800}}'
  );
});

it("should perform a venue related events preset search", async () => {
  const result = await service.get(
    `/search/preset/${presetSearchType.VENUE_RELATED_EVENTS}?id=${
      testData.VENUE_ACTIVE_ALMEIDA_THEATRE.id
    }`
  );

  expect(result).toEqual(
    '{body={"items":[{"entityType":"event","venueId":"almeida-theatre","name":"Andy Warhol: New York Start","dateTo":"2019-04-12","dates":[{"date":"2018-06-26","from":"10:00","to":"18:00"}],"id":"andy-warhol-exhibition","dateFrom":"2018-06-14","status":"Active"}],"total":1,"params":{"id":"almeida-theatre","name":"venue-related-events","isOffline":true,"stageVariables":{}}}, headers={Cache-Control=public, max-age=1800}}'
  );
});

it("should perform an events by external ids preset search", async () => {
  const result = await service.get(
    `/search/preset/${
      presetSearchType.EVENTS_BY_EXTERNAL_IDS
    }?id=foo,bar&admin=true`
  );

  expect(result).toEqual(
    '{body={"items":[],"total":0,"params":{"admin":true,"id":"foo,bar","name":"events-by-external-ids","isOffline":true,"stageVariables":{}}}, headers={Cache-Control=no-cache}}'
  );
});
