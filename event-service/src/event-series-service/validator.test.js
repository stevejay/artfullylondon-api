import * as testData from "../../tests/utils/test-data";
import * as eventSeriesType from "../types/event-series-type";
import * as validator from "./validator";

describe("event series validator", () => {
  it("should pass fully populated event series params", () => {
    const params = testData.createFullRequestEventSeries();
    expect(() =>
      validator.validateCreateOrUpdateEventSeriesRequest(params)
    ).not.toThrow();
  });

  it("should pass minimal populated event series params", () => {
    const params = testData.createMinimalRequestEventSeries();
    expect(() =>
      validator.validateCreateOrUpdateEventSeriesRequest(params)
    ).not.toThrow();
  });

  it("should pass a seasonal event series", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.eventSeriesType = eventSeriesType.SEASON;
    expect(() =>
      validator.validateCreateOrUpdateEventSeriesRequest(params)
    ).not.toThrow();
  });

  it("should pass an occasional event series", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.eventSeriesType = eventSeriesType.OCCASIONAL;
    expect(() =>
      validator.validateCreateOrUpdateEventSeriesRequest(params)
    ).not.toThrow();
  });

  it("should fail an unknown event series", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.eventSeriesType = "whatever";
    expect(() =>
      validator.validateCreateOrUpdateEventSeriesRequest(params)
    ).toThrow(
      "[400] Bad Request: Event Series Type is not included in the list"
    );
  });

  it("should fail an empty name", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.name = "";
    expect(() =>
      validator.validateCreateOrUpdateEventSeriesRequest(params)
    ).toThrow("[400] Bad Request: Name is too short (minimum length is 1)");
  });

  it("should fail an empty occurrence", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.occurrence = "";
    expect(() =>
      validator.validateCreateOrUpdateEventSeriesRequest(params)
    ).toThrow(
      "[400] Bad Request: Occurrence is too short (minimum length is 1)"
    );
  });

  it("should fail an empty summary", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.summary = "";
    expect(() =>
      validator.validateCreateOrUpdateEventSeriesRequest(params)
    ).toThrow("[400] Bad Request: Summary is too short (minimum length is 1)");
  });

  it("should fail an empty description", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.description = "";
    expect(() =>
      validator.validateCreateOrUpdateEventSeriesRequest(params)
    ).toThrow(
      "[400] Bad Request: Description is too short (minimum length is 1)"
    );
  });

  it("should fail a null version", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.version = null;
    expect(() =>
      validator.validateCreateOrUpdateEventSeriesRequest(params)
    ).toThrow("[400] Bad Request: Version can't be blank");
  });
});
