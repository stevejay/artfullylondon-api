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
    `/public/search/auto?term=car&entityType=${entityType.TALENT}`
  );

  expect(result).toEqual({
    items: [
      {
        commonRole: "Director",
        entityType: entityType.TALENT,
        id: 1,
        name: "Carrie Cracknell",
        nameSuggest: "Carrie Cracknell",
        output: "Carrie Cracknell",
        status: "Active"
      }
    ],
    params: { entityType: entityType.TALENT, term: "car" }
  });
});

it("should perform a public search of talents when there are no matches", async () => {
  const result = await service.get(
    `/public/search/auto?term=foo&entityType=${entityType.TALENT}`
  );

  expect(result).toEqual({
    items: [],
    params: { entityType: entityType.TALENT, term: "foo" }
  });
});

it("should perform a public search of everything", async () => {
  const result = await service.get("/public/search/auto?term=car");

  expect(result).toEqual({
    items: [
      {
        commonRole: "Director",
        entityType: entityType.TALENT,
        id: 1,
        name: "Carrie Cracknell",
        nameSuggest: "Carrie Cracknell",
        output: "Carrie Cracknell",
        status: "Active"
      },
      {
        status: "Active",
        entityType: entityType.VENUE,
        venueType: "Theatre",
        address: "59 Some St",
        postcode: "N6 2AA",
        id: 3,
        name: "Carrillion Theatre",
        nameSuggest: "Carrillion Theatre",
        output: "Carrillion Theatre"
      }
    ],
    params: { entityType: entityType.ALL, term: "car" }
  });
});
