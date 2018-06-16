import * as service from "../utils/service";
import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/types/search-index-type";
import * as entityType from "../../src/types/entity-type";
jest.setTimeout(60000);

beforeAll(async () => {
  await elasticsearch.createIndex(searchIndexType.TALENT);
  await elasticsearch.createIndex(searchIndexType.VENUE);
  await elasticsearch.createIndex(searchIndexType.EVENT);
  await elasticsearch.createIndex(searchIndexType.EVENT_SERIES);

  await elasticsearch.indexDocument(searchIndexType.TALENT, {
    status: "Active",
    id: "1",
    commonRole: "Director",
    entityType: entityType.TALENT,
    firstNames: "Carrie",
    lastName: "Cracknell",
    lastName_sort: "cracknell"
  });
  await elasticsearch.indexDocument(searchIndexType.TALENT, {
    status: "Active",
    id: "2",
    commonRole: "Actor",
    entityType: entityType.TALENT,
    firstNames: "Dave",
    lastName: "Donnelly",
    lastName_sort: "donnelly"
  });

  await elasticsearch.indexDocument(searchIndexType.VENUE, {
    status: "Active",
    id: "1",
    entityType: entityType.VENUE,
    name: "Almeida Theatre"
  });
  await elasticsearch.indexDocument(searchIndexType.VENUE, {
    status: "Deleted",
    id: "2",
    entityType: entityType.VENUE,
    name: "Arcola Theatre",
    latitude: 1,
    longitude: 2,
    locationOptimized: {
      lat: 1,
      lon: 2
    }
  });

  await elasticsearch.indexDocument(searchIndexType.EVENT_SERIES, {
    status: "Active",
    id: "1",
    entityType: entityType.EVENT_SERIES,
    name: "Bang Said the Gun"
  });

  await elasticsearch.indexDocument(searchIndexType.EVENT, {
    status: "Active",
    id: "1",
    entityType: entityType.EVENT,
    name: "Andy Warhol: New York Start"
  });
});

afterAll(async () => {
  await elasticsearch.deleteIndex(searchIndexType.TALENT);
  await elasticsearch.deleteIndex(searchIndexType.VENUE);
  await elasticsearch.deleteIndex(searchIndexType.EVENT);
  await elasticsearch.deleteIndex(searchIndexType.EVENT_SERIES);
});

it("should perform a public search of talents", async () => {
  const result = await service.get(
    `/search/basic?term=carrie&entityType=${entityType.TALENT}`
  );

  expect(result).toEqual(
    '{body={"items":[{"lastName":"Cracknell","entityType":"talent","commonRole":"Director","firstNames":"Carrie","id":"1","status":"Active"}],"total":1,"params":{"term":"carrie","entityType":"talent","skip":0,"take":12,"isOffline":true,"stageVariables":{}}}, headers={Cache-Control=public, max-age=1800}}'
  );
});

it("should perform an admin search of venues", async () => {
  const result = await service.get(
    `/search/basic?term=theatre&entityType=${entityType.VENUE}&admin=true`
  );

  expect(result).toEqual(
    '{body={"items":[{"entityType":"venue","name":"Almeida Theatre","id":"1","status":"Active"},{"entityType":"venue","latitude":1,"name":"Arcola Theatre","id":"2","status":"Deleted","longitude":2}],"total":2,"params":{"admin":true,"term":"theatre","entityType":"venue","skip":0,"take":12,"isOffline":true,"stageVariables":{}}}, headers={Cache-Control=no-cache}}'
  );
});

it("should perform a public search of all venues", async () => {
  const result = await service.get(
    `/search/basic?entityType=${entityType.VENUE}`
  );

  expect(result).toEqual(
    '{body={"items":[{"entityType":"venue","name":"Almeida Theatre","id":"1","status":"Active"},{"entityType":"venue","latitude":1,"name":"Arcola Theatre","id":"2","status":"Deleted","longitude":2}],"total":2,"params":{"entityType":"venue","skip":0,"take":12,"isOffline":true,"stageVariables":{}}}, headers={Cache-Control=public, max-age=1800}}'
  );
});

it("should perform a admin location search of venues", async () => {
  const result = await service.get(
    `/search/basic?entityType=${
      entityType.VENUE
    }&north=4&south=-4&east=4&west=-4&admin=true`
  );

  expect(result).toEqual(
    '{body={"items":[{"entityType":"venue","latitude":1,"name":"Arcola Theatre","id":"2","status":"Deleted","longitude":2}],"total":1,"params":{"admin":true,"entityType":"venue","north":4,"west":-4,"south":-4,"east":4,"skip":0,"take":12,"isOffline":true,"stageVariables":{}}}, headers={Cache-Control=no-cache}}'
  );
});

it("should perform a public search of all event series", async () => {
  const result = await service.get(
    `/search/basic?entityType=${entityType.EVENT_SERIES}`
  );

  expect(result).toEqual(
    '{body={"items":[{"entityType":"event-series","name":"Bang Said the Gun","id":"1","status":"Active"}],"total":1,"params":{"entityType":"event-series","skip":0,"take":12,"isOffline":true,"stageVariables":{}}}, headers={Cache-Control=public, max-age=1800}}'
  );
});

it("should perform a public search of all events", async () => {
  const result = await service.get(
    `/search/basic?entityType=${entityType.EVENT}`
  );

  expect(result).toEqual(
    '{body={"items":[{"entityType":"event","name":"Andy Warhol: New York Start","id":"1","status":"Active"}],"total":1,"params":{"entityType":"event","skip":0,"take":12,"isOffline":true,"stageVariables":{}}}, headers={Cache-Control=public, max-age=1800}}'
  );
});
