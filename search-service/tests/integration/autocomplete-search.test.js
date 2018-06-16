import * as service from "../utils/service";
import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/types/search-index-type";
import * as entityType from "../../src/types/entity-type";
jest.setTimeout(60000);

beforeAll(async () => {
  await elasticsearch.createIndex(searchIndexType.AUTOCOMPLETE);
  await elasticsearch.indexDocument(searchIndexType.AUTOCOMPLETE, {
    status: "Active",
    commonRole: "Director",
    entityType: entityType.TALENT,
    id: 1,
    nameSuggest: "Carrie Cracknell",
    output: "Carrie Cracknell"
  });
  await elasticsearch.indexDocument(searchIndexType.AUTOCOMPLETE, {
    status: "Active",
    commonRole: "Actor",
    entityType: entityType.TALENT,
    id: 2,
    nameSuggest: "Dave Donnelly",
    output: "Dave Donnelly"
  });
  await elasticsearch.indexDocument(searchIndexType.AUTOCOMPLETE, {
    status: "Active",
    entityType: entityType.VENUE,
    venueType: "Theatre",
    address: "59 Some St",
    postcode: "N6 2AA",
    id: 3,
    nameSuggest: "Carrillion Theatre",
    output: "Carrillion Theatre"
  });
});

afterAll(async () => {
  await elasticsearch.deleteIndex(searchIndexType.AUTOCOMPLETE);
});

it("should perform a public search of talents", async () => {
  const result = await service.get(
    `/search/auto?term=car&entityType=${entityType.TALENT}`
  );

  expect(result).toEqual(
    '{body={"items":[{"status":"Active","commonRole":"Director","entityType":"talent","id":1,"nameSuggest":"Carrie Cracknell","output":"Carrie Cracknell","name":"Carrie Cracknell"}],"params":{"term":"car","entityType":"talent","isOffline":true,"stageVariables":{}}}, headers={Cache-Control=public, max-age=1800}}'
  );
});

it("should perform a public search of talents when there are no matches", async () => {
  const result = await service.get(
    `/search/auto?term=foo&entityType=${entityType.TALENT}`
  );

  expect(result).toEqual(
    '{body={"items":[],"params":{"term":"foo","entityType":"talent","isOffline":true,"stageVariables":{}}}, headers={Cache-Control=public, max-age=1800}}'
  );
});

it("should perform an admin search of everything", async () => {
  const result = await service.get("/search/auto?term=car&admin=true");

  expect(result).toEqual(
    '{body={"items":[{"status":"Active","commonRole":"Director","entityType":"talent","id":1,"nameSuggest":"Carrie Cracknell","output":"Carrie Cracknell","name":"Carrie Cracknell"},{"status":"Active","entityType":"venue","venueType":"Theatre","address":"59 Some St","postcode":"N6 2AA","id":3,"nameSuggest":"Carrillion Theatre","output":"Carrillion Theatre","name":"Carrillion Theatre"}],"params":{"admin":true,"term":"car","entityType":"all","isOffline":true,"stageVariables":{}}}, headers={Cache-Control=no-cache}}'
  );
});
