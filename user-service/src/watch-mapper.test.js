import * as watchMapper from "./watch-mapper";
import * as entityType from "./entity-type";

describe("mapResponseForSingleWatchType", () => {
  it("should map a db item", () => {
    const dbItem = {
      entityType: entityType.EVENT,
      version: 1,
      items: [{ id: 1, label: "a", created: 1111 }]
    };

    const result = watchMapper.mapResponseForSingleWatchType(
      entityType.EVENT,
      dbItem
    );
    expect(result).toEqual(dbItem);
  });

  it("should handle no db item", () => {
    const result = watchMapper.mapResponseForSingleWatchType(
      entityType.EVENT,
      null
    );
    expect(result).toEqual({
      entityType: entityType.EVENT,
      version: 0,
      items: []
    });
  });
});

describe("mapResponseForAllWatchTypes", () => {
  it("should handle no db items", () => {
    const result = watchMapper.mapResponseForAllWatchTypes([]);
    expect(result).toEqual({
      watches: expect.arrayContaining([
        { entityType: entityType.TAG, version: 0, items: [] },
        { entityType: entityType.TALENT, version: 0, items: [] },
        { entityType: entityType.VENUE, version: 0, items: [] },
        { entityType: entityType.EVENT, version: 0, items: [] },
        { entityType: entityType.EVENT_SERIES, version: 0, items: [] }
      ])
    });
  });

  it("should handle some db items", () => {
    const result = watchMapper.mapResponseForAllWatchTypes([
      {
        entityType: entityType.EVENT,
        version: 1,
        items: [{ id: 1, label: "a", created: 1111 }]
      }
    ]);
    expect(result).toEqual({
      watches: expect.arrayContaining([
        { entityType: entityType.TAG, version: 0, items: [] },
        { entityType: entityType.TALENT, version: 0, items: [] },
        { entityType: entityType.VENUE, version: 0, items: [] },
        {
          entityType: entityType.EVENT,
          version: 1,
          items: [{ id: 1, label: "a", created: 1111 }]
        },
        { entityType: entityType.EVENT_SERIES, version: 0, items: [] }
      ])
    });
  });
});
