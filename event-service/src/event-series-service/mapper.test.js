import * as testData from "../../tests/utils/test-data";
import * as mapper from "./mapper";
import * as timeUtils from "../entity/time-utils";
import * as entityType from "../types/entity-type";
import * as eventSeriesType from "../types/event-series-type";
import * as linkType from "../types/link-type";
import * as statusType from "../types/status-type";

describe("mapCreateOrUpdateEventSeriesRequest", () => {
  beforeEach(() => {
    timeUtils.getCreatedDateForDB = jest.fn().mockReturnValue("2016-01-11");
  });

  it("should map a minimal event series", () => {
    const params = testData.createMinimalRequestEventSeries();

    const result = mapper.mapCreateOrUpdateEventSeriesRequest({
      ...params,
      id: testData.EVENT_SERIES_ID
    });

    expect(result).toEqual({
      id: testData.EVENT_SERIES_ID,
      name: "Bang Said The Gun",
      status: statusType.ACTIVE,
      eventSeriesType: eventSeriesType.OCCASIONAL,
      occurrence: "Third Thursday of each month",
      summary: "A poetry riot",
      description: "Poetry for people who dont like poetry.",
      version: 1,
      schemeVersion: mapper.CURRENT_EVENT_SERIES_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });

  it("should map a fully populated event series", () => {
    const params = testData.createFullRequestEventSeries();

    const result = mapper.mapCreateOrUpdateEventSeriesRequest({
      ...params,
      id: testData.EVENT_SERIES_ID
    });

    expect(result).toEqual({
      id: testData.EVENT_SERIES_ID,
      name: "Bang Said The Gun",
      status: statusType.ACTIVE,
      eventSeriesType: eventSeriesType.OCCASIONAL,
      occurrence: "Third Thursday of each month",
      summary: "A poetry riot",
      description: "Poetry for people who dont like poetry.",
      descriptionCredit: "Some description credit",
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "Foo"
        }
      ],
      weSay: "something",
      version: 1,
      schemeVersion: mapper.CURRENT_EVENT_SERIES_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });
});

describe("mapToPublicSummaryResponse", () => {
  it("should map a fully populated event series", () => {
    const dbItem = testData.createFullDbEventSeries();

    const result = mapper.mapToPublicSummaryResponse(dbItem);

    expect(result).toEqual({
      entityType: entityType.EVENT_SERIES,
      id: testData.EVENT_SERIES_ID,
      status: statusType.ACTIVE,
      name: "Bang Said The Gun",
      eventSeriesType: eventSeriesType.OCCASIONAL,
      occurrence: "Third Thursday of each month",
      summary: "A poetry riot",
      image: "abcd1234abcd1234abcd1234abcd1234",
      imageCopyright: "Foo",
      imageRatio: 1.2
    });
  });
});

describe("mapToPublicFullResponse", () => {
  it("should map a fully populated event series", () => {
    const dbItem = testData.createFullDbEventSeries();

    const result = mapper.mapToPublicFullResponse(dbItem);

    expect(result).toEqual({
      entityType: entityType.EVENT_SERIES,
      isFullEntity: true,
      id: testData.EVENT_SERIES_ID,
      status: statusType.ACTIVE,
      name: "Bang Said The Gun",
      eventSeriesType: eventSeriesType.OCCASIONAL,
      occurrence: "Third Thursday of each month",
      summary: "A poetry riot",
      image: "abcd1234abcd1234abcd1234abcd1234",
      imageCopyright: "Foo",
      imageRatio: 1.2,
      description: "Poetry for people who dont like poetry.",
      descriptionCredit: "Some description credit",
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      images: [
        {
          id: "abcd1234abcd1234abcd1234abcd1234",
          ratio: 1.2,
          copyright: "Foo"
        }
      ],
      weSay: "something",
      version: 1
    });
  });
});
