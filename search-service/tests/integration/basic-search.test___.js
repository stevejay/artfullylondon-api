import * as service from "../utils/service";
import * as elasticsearch from "../utils/elasticsearch";
import * as searchTemplateType from "../../src/searcher/search-template-type";
import * as searchIndexType from "../../src/search-index-type";
import * as entityType from "../../src/entity-type";
jest.setTimeout(60000);

beforeAll(async () => {
  await elasticsearch.createTemplate(searchTemplateType.VENUE);
  await elasticsearch.createTemplate(searchTemplateType.TALENT);
  await elasticsearch.createTemplate(searchTemplateType.EVENT);
  await elasticsearch.createTemplate(searchTemplateType.EVENT_SERIES);

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
    `/public/search/basic?term=carrie&entityType=${entityType.TALENT}`
  );

  expect(result).toEqual({
    items: [
      {
        commonRole: "Director",
        entityType: entityType.TALENT,
        firstNames: "Carrie",
        id: "1",
        lastName: "Cracknell",
        status: "Active"
      }
    ],
    params: {
      entityType: entityType.TALENT,
      skip: 0,
      take: 12,
      term: "carrie",
      isPublic: true
    },
    total: 1
  });
});

it("should perform an admin search of venues", async () => {
  const result = await service.get(
    `/admin/search/basic?term=theatre&entityType=${entityType.VENUE}`
  );

  expect(result).toEqual({
    items: [
      {
        entityType: entityType.VENUE,
        id: "1",
        name: "Almeida Theatre",
        status: "Active"
      },
      {
        entityType: entityType.VENUE,
        id: "2",
        name: "Arcola Theatre",
        status: "Deleted",
        latitude: 1,
        longitude: 2
      }
    ],
    params: {
      entityType: entityType.VENUE,
      isPublic: false,
      skip: 0,
      take: 12,
      term: "theatre"
    },
    total: 2
  });
});

it("should perform a public search of all venues", async () => {
  const result = await service.get(
    `/public/search/basic?entityType=${entityType.VENUE}`
  );

  expect(result).toEqual({
    items: [
      {
        entityType: entityType.VENUE,
        id: "1",
        name: "Almeida Theatre",
        status: "Active"
      }
    ],
    params: {
      entityType: entityType.VENUE,
      isPublic: true,
      skip: 0,
      take: 12
    },
    total: 1
  });
});

it("should perform a admin location search of venues", async () => {
  const result = await service.get(
    `/admin/search/basic?entityType=${
      entityType.VENUE
    }&north=4&south=-4&east=4&west=-4`
  );

  expect(result).toEqual({
    items: [
      {
        entityType: entityType.VENUE,
        id: "2",
        name: "Arcola Theatre",
        status: "Deleted",
        latitude: 1,
        longitude: 2
      }
    ],
    params: {
      entityType: entityType.VENUE,
      isPublic: false,
      location: { east: 4, north: 4, south: -4, west: -4 },
      skip: 0,
      take: 12
    },
    total: 1
  });
});

it("should perform a public search of all event series", async () => {
  const result = await service.get(
    `/public/search/basic?entityType=${entityType.EVENT_SERIES}`
  );

  expect(result).toEqual({
    items: [
      {
        entityType: entityType.EVENT_SERIES,
        id: "1",
        name: "Bang Said the Gun",
        status: "Active"
      }
    ],
    params: {
      entityType: entityType.EVENT_SERIES,
      isPublic: true,
      skip: 0,
      take: 12
    },
    total: 1
  });
});

it("should perform a public search of all events", async () => {
  const result = await service.get(
    `/public/search/basic?entityType=${entityType.EVENT}`
  );

  expect(result).toEqual({
    items: [
      {
        entityType: entityType.EVENT,
        id: "1",
        name: "Andy Warhol: New York Start",
        status: "Active"
      }
    ],
    params: {
      entityType: entityType.EVENT,
      isPublic: true,
      skip: 0,
      take: 12
    },
    total: 1
  });
});
