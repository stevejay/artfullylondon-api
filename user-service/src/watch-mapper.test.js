import * as watchMapper from "./watch-mapper";
import * as watchType from "./watch-type";

describe("mapResponseForSingleWatchType", () => {
  it("should map a db item", () => {
    const dbItem = {
      watchType: watchType.EVENT,
      version: 1,
      items: [{ id: 1, label: "a", created: 1111 }]
    };

    const result = watchMapper.mapResponseForSingleWatchType(
      watchType.EVENT,
      dbItem
    );
    expect(result).toEqual(dbItem);
  });

  it("should handle no db item", () => {
    const result = watchMapper.mapResponseForSingleWatchType(
      watchType.EVENT,
      null
    );
    expect(result).toEqual({
      watchType: watchType.EVENT,
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
        { watchType: watchType.TAG, version: 0, items: [] },
        { watchType: watchType.TALENT, version: 0, items: [] },
        { watchType: watchType.VENUE, version: 0, items: [] },
        { watchType: watchType.EVENT, version: 0, items: [] },
        { watchType: watchType.EVENT_SERIES, version: 0, items: [] }
      ])
    });
  });

  it("should handle some db items", () => {
    const result = watchMapper.mapResponseForAllWatchTypes([
      {
        watchType: watchType.EVENT,
        version: 1,
        items: [{ id: 1, label: "a", created: 1111 }]
      }
    ]);
    expect(result).toEqual({
      watches: expect.arrayContaining([
        { watchType: watchType.TAG, version: 0, items: [] },
        { watchType: watchType.TALENT, version: 0, items: [] },
        { watchType: watchType.VENUE, version: 0, items: [] },
        {
          watchType: watchType.EVENT,
          version: 1,
          items: [{ id: 1, label: "a", created: 1111 }]
        },
        { watchType: watchType.EVENT_SERIES, version: 0, items: [] }
      ])
    });
  });
});
