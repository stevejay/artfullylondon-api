"use strict";

const ensure = require("ensure-request").ensure;
const testData = require("../test-data");
const constants = require("./constants");
const constraints = require("./constraints");
const ensureErrorHandler = require("../data/ensure-error-handler");

describe("event series constraints", () => {
  it("should pass fully populated event series params", () => {
    const params = testData.createFullRequestEventSeries();
    expect(() =>
      ensure(params, constraints, ensureErrorHandler)
    ).to.not.throw();
  });

  it("should pass minimal populated event series params", () => {
    const params = testData.createMinimalRequestEventSeries();
    expect(() =>
      ensure(params, constraints, ensureErrorHandler)
    ).to.not.throw();
  });

  it("should pass a seasonal event series", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.eventSeriesType = constants.EVENT_SERIES_TYPE_SEASON;
    expect(() =>
      ensure(params, constraints, ensureErrorHandler)
    ).to.not.throw();
  });

  it("should pass an occasional event series", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.eventSeriesType = constants.EVENT_SERIES_TYPE_OCCASIONAL;
    expect(() =>
      ensure(params, constraints, ensureErrorHandler)
    ).to.not.throw();
  });

  it("should fail an unknown event series", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.eventSeriesType = "whatever";
    expect(() => ensure(params, constraints, ensureErrorHandler)).to.throw(
      "[400] Bad Request: Event Series Type is not included in the list"
    );
  });

  it("should fail an empty name", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.name = "";
    expect(() => ensure(params, constraints, ensureErrorHandler)).to.throw(
      "[400] Bad Request: Name is too short (minimum length is 1)"
    );
  });

  it("should fail an empty occurrence", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.occurrence = "";
    expect(() => ensure(params, constraints, ensureErrorHandler)).to.throw(
      "[400] Bad Request: Occurrence is too short (minimum length is 1)"
    );
  });

  it("should fail an empty summary", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.summary = "";
    expect(() => ensure(params, constraints, ensureErrorHandler)).to.throw(
      "[400] Bad Request: Summary is too short (minimum length is 1)"
    );
  });

  it("should fail an empty description", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.description = "";
    expect(() => ensure(params, constraints, ensureErrorHandler)).to.throw(
      "[400] Bad Request: Description is too short (minimum length is 1)"
    );
  });

  it("should fail a null version", () => {
    const params = testData.createMinimalRequestEventSeries();
    params.version = null;
    expect(() => ensure(params, constraints, ensureErrorHandler)).to.throw(
      "[400] Bad Request: Version can't be blank"
    );
  });
});
