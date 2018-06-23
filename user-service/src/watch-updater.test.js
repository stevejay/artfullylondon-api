import watchUpdater from "./watch-updater";
import * as watchChangeType from "./watch-change-type";

describe("watch updater", () => {
  it("should create a watch", () => {
    const result = watchUpdater(0, 1, null, [
      {
        changeType: watchChangeType.ADD,
        id: 1,
        label: "a",
        created: 1111
      }
    ]);

    expect(result).toEqual([
      {
        id: 1,
        label: "a",
        created: 1111
      }
    ]);
  });

  it("should add a watch", () => {
    const result = watchUpdater(
      0,
      1,
      [
        {
          id: 1,
          label: "a",
          created: 1111
        }
      ],
      [
        {
          changeType: watchChangeType.ADD,
          id: 2,
          label: "b",
          created: 2222
        }
      ]
    );

    expect(result).toEqual([
      {
        id: 1,
        label: "a",
        created: 1111
      },
      {
        id: 2,
        label: "b",
        created: 2222
      }
    ]);
  });

  it("should delete a watch", () => {
    const result = watchUpdater(
      0,
      1,
      [
        {
          id: 1,
          label: "a",
          created: 1111
        },
        {
          id: 2,
          label: "b",
          created: 2222
        }
      ],
      [
        {
          changeType: watchChangeType.DELETE,
          id: 2
        }
      ]
    );

    expect(result).toEqual([
      {
        id: 1,
        label: "a",
        created: 1111
      }
    ]);
  });

  it("should delete the last watch", () => {
    const result = watchUpdater(
      0,
      1,
      [
        {
          id: 1,
          label: "a",
          created: 1111
        }
      ],
      [
        {
          changeType: watchChangeType.DELETE,
          id: 1
        }
      ]
    );

    expect(result).toEqual([]);
  });

  it("should reject a stale update", () => {
    expect(() =>
      watchUpdater(
        2,
        1,
        [
          {
            id: 1,
            label: "a",
            created: 1111
          }
        ],
        [
          {
            changeType: watchChangeType.ADD,
            id: 2,
            label: "b",
            created: 2222
          }
        ]
      )
    ).toThrow(/Stale data/);
  });
});
