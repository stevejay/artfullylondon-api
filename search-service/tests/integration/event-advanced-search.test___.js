import * as service from "../utils/service";
import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/types/search-index-type";
import * as entityType from "../../src/types/entity-type";
jest.setTimeout(60000);

beforeAll(async () => {
  await elasticsearch.createIndex(searchIndexType.EVENT);
  await elasticsearch.indexDocument(searchIndexType.EVENT, {
    status: "Active",
    id: "1",
    entityType: entityType.EVENT,
    name: "Foo"
  });
  await elasticsearch.indexDocument(searchIndexType.EVENT, {
    status: "Active",
    id: "2",
    entityType: entityType.EVENT,
    name: "Bar"
  });
});

afterAll(async () => {
  await elasticsearch.deleteIndex(searchIndexType.EVENT);
});

it("should perform a public search", async () => {
  const result = await service.get("/public/search/event?term=foo");

  expect(result).toEqual({
    items: [
      { entityType: entityType.EVENT, id: "1", name: "Foo", status: "Active" }
    ],
    params: { skip: 0, take: 12, term: "foo" },
    total: 1
  });
});
