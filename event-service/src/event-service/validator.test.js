import * as testData from "../../tests/utils/test-data";
import * as validator from "./validator";

describe ('event validator', () => {
  it("should pass fully populated performance event params", () => {
    const params = testData.createFullPerformanceRequestEvent();
    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should pass fully populated course event params", () => {
    const params = testData.createFullCourseRequestEvent();
    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should pass minimal performance event params", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should pass minimal course event params", () => {
    const params = testData.createMinimalCourseRequestEvent();
    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should pass a bounded performance", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Performance";
    params.occurrenceType = "Bounded";
    params.dateFrom = "2016-09-17";
    params.dateTo = "2016-09-25";

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should fail a bounded performance without dates", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Performance";
    params.occurrenceType = "Bounded";
    params.dateFrom = params.dateTo = undefined;

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Date to must be greater than or equal to date from and both must be given"
    );
  });

  it("should fail a bounded performance with partial dates", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Performance";
    params.occurrenceType = "Bounded";
    params.dateFrom = "2016-09-17";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Date to must be greater than or equal to date from and both must be given"
    );
  });

  it("should pass a continuous performance", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Performance";
    params.occurrenceType = "Continuous";
    params.dateFrom = params.dateTo = undefined;

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should fail a continuous performance with dates", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Performance";
    params.occurrenceType = "Continuous";
    params.dateFrom = "2016-09-17";
    params.dateTo = "2016-09-25";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Date from and date to must be null"
    );
  });

  it("should pass a one-time performance", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Performance";
    params.occurrenceType = "OneTime";
    params.dateFrom = params.dateTo = "2016-09-25";

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should fail a one-time performance without dates", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Performance";
    params.occurrenceType = "OneTime";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Date from must equal date to and both must be given"
    );
  });

  it("should fail a one-time performance with dates apart", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Performance";
    params.occurrenceType = "OneTime";
    params.dateFrom = "2016-09-17";
    params.dateTo = "2016-09-25";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Date from must equal date to and both must be given"
    );
  });

  it("should pass a bounded exhibition", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Exhibition";
    params.occurrenceType = "Bounded";
    params.dateFrom = "2016-09-17";
    params.dateTo = "2016-09-25";

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should fail a bounded exhibition without dates", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Exhibition";
    params.occurrenceType = "Bounded";
    params.dateFrom = params.dateTo = undefined;

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Date to must be greater than or equal to date from and both must be given"
    );
  });

  it("should fail a bounded exhibition with partial dates", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Exhibition";
    params.occurrenceType = "Bounded";
    params.dateFrom = undefined;
    params.dateTo = "2016-09-25";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Date to must be greater than or equal to date from and both must be given"
    );
  });

  it("should fail a one-time exhibition", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Exhibition";
    params.occurrenceType = "OneTime";
    params.dateFrom = params.dateTo = "2016-09-25";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Occurrence type is not valid for exhibition event"
    );
  });

  it("should pass a continuous exhibition", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Exhibition";
    params.occurrenceType = "Continuous";
    params.dateFrom = params.dateTo = undefined;

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should fail a continuous exhibition with dates", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.eventType = "Exhibition";
    params.occurrenceType = "Continuous";
    params.dateFrom = "2016-09-17";
    params.dateTo = "2016-09-25";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Date from and date to must be null"
    );
  });

  it("should pass a free event", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.costType = "Free";

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should fail a free event with cost range", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.costType = "Free";
    params.costFrom = 3.99;
    params.costTo = 4.99;

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Cost from and cost to must be null"
    );
  });

  it("should pass a paid event with cost range", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.costType = "Paid";
    params.costFrom = 3.99;
    params.costTo = 4.99;

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should fail a paid event with no cost range", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.costType = "Paid";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Cost to must be greater than or equal to cost from and both must be given"
    );
  });

  it("should fail a paid event with partial cost range", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.costType = "Paid";
    params.costFrom = 3.99;

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Cost to must be greater than or equal to cost from and both must be given"
    );
  });

  it("should pass an event that does not require booking", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.bookingType = "NotRequired";

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should fail an event that does not require booking but that has a booking date", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.bookingType = "NotRequired";
    params.bookingOpens = "2016-03-15";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Booking opens must be null"
    );
  });

  it("should pass an event that requires booking", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.bookingType = "Required";
    params.bookingOpens = "2016-03-15";

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should not fail an event that requires booking but that has no booking date", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.bookingType = "Required";

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should pass an event that requires booking for non-members", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.bookingType = "RequiredForNonMembers";
    params.bookingOpens = "2016-03-15";

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should not fail an event that requires booking for non-members but that has no booking date", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.bookingType = "RequiredForNonMembers";

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should fail an event with review with no source", () => {
    const params = testData.createMinimalPerformanceRequestEvent();

    params.reviews = [{ source: "", rating: 4 }];

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Source is too short (minimum length is 1)"
    );
  });

  it("should fail an event with review with invalid rating", () => {
    const params = testData.createMinimalPerformanceRequestEvent();

    params.reviews = [{ source: "The Guardian", rating: "4" }];

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Rating is not a number"
    );
  });

  it("should pass a performance event without times range ids on the performance times", () => {
    const params = testData.createMinimalPerformanceRequestEvent();

    params.performances = [{ day: 2, at: "19:30" }, { day: 3, at: "19:30" }];

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should pass a performance event with times range ids on the performance times that are in the times ranges array", () => {
    const params = testData.createMinimalPerformanceRequestEvent();

    params.timesRanges = [
      {
        id: "previews",
        dateFrom: "2016-02-11",
        dateTo: "2016-02-13",
        label: "Previews"
      }
    ];

    params.performances = [
      { day: 2, at: "19:30", timesRangeId: "previews" },
      { day: 3, at: "19:30", timesRangeId: "previews" }
    ];

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should fail a performance event with times range ids on the performance times that are not in the times ranges array", () => {
    const params = testData.createMinimalPerformanceRequestEvent();

    params.timesRanges = [
      {
        id: "previews",
        dateFrom: "2016-02-11",
        dateTo: "2016-02-13",
        label: "Previews"
      }
    ];

    params.performances = [
      { day: 2, at: "19:30", timesRangeId: "all-run" },
      { day: 3, at: "19:30", timesRangeId: "previews" }
    ];

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: All Opening Times / Performances must have a recognized Times Range Id"
    );
  });

  it("should fail a performance event with missing times range id on the performance times", () => {
    const params = testData.createMinimalPerformanceRequestEvent();

    params.timesRanges = [
      {
        id: "previews",
        dateFrom: "2016-02-11",
        dateTo: "2016-02-13",
        label: "Previews"
      }
    ];

    params.performances = [
      { day: 2, at: "19:30" },
      { day: 3, at: "19:30", timesRangeId: "previews" }
    ];

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: All Opening Times / Performances must have a recognized Times Range Id"
    );
  });

  it("should fail a course event with continuous occurrence type", () => {
    const params = testData.createMinimalCourseRequestEvent();
    params.occurrenceType = "Continuous";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Occurrence type is not valid for course event"
    );
  });

  it("should fail a course event with one-time occurrence type", () => {
    const params = testData.createMinimalCourseRequestEvent();
    params.occurrenceType = "OneTime";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Occurrence type is not valid for course event"
    );
  });

  it("should fail a course event with non-bool sold out value", () => {
    const params = testData.createMinimalCourseRequestEvent();
    params.soldOut = "foo";

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Sold Out is not boolean"
    );
  });

  it("should fail a course event with a negative min age", () => {
    const params = testData.createMinimalCourseRequestEvent();
    params.minAge = -1;

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Min Age is not greater than or equal to 0"
    );
  });

  it("should fail a course event with a max age less than the min age", () => {
    const params = testData.createMinimalCourseRequestEvent();
    params.minAge = 8;
    params.maxAge = 4;

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Max age must be greater than or equal to Min age"
    );
  });

  it("should fail a course event with a max age that is too high", () => {
    const params = testData.createMinimalCourseRequestEvent();
    params.maxAge = 999;

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Max Age is not less than or equal to 99"
    );
  });

  it("should fail a course event that uses the venue opening times", () => {
    const params = testData.createMinimalCourseRequestEvent();
    params.useVenueOpeningTimes = true;

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Cannot use venue opening times if event is a performance or a course"
    );
  });

  it("should fail an exhibition event with a non-boolean timed entry flag", () => {
    const params = testData.createMinimalExhibitionRequestEvent();
    params.timedEntry = 999;

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Timed Entry is not boolean"
    );
  });

  it("should fail a performance event with a timed entry flag", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.timedEntry = true;

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Only exhibition events can have the timed entry flag set"
    );
  });

  it("should fail a performance event with an invalid date in the sold out performances", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.soldOutPerformances = [{ date: "foo", at: "18:00" }];

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Date is in the wrong format"
    );
  });

  it("should fail a performance event with an invalid time in the sold out performances", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.soldOutPerformances = [{ date: "2017-01-20", at: "bar" }];

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: At is in the wrong format"
    );
  });

  it("should pass a performance event with valid sold out performances", () => {
    const params = testData.createMinimalPerformanceRequestEvent();
    params.soldOutPerformances = [{ date: "2017-01-20", at: "18:00" }];

    expect(() =>
      validator.validateCreateOrUpdateEventRequest(params)
    ).not.toThrow();
  });

  it("should fail an exhibition event with sold out performances", () => {
    const params = testData.createMinimalExhibitionRequestEvent();
    params.soldOutPerformances = [{ date: "2017-01-20", at: "18:00" }];

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Can only have sold out performances if event is a performance"
    );
  });

  it("should fail a course event with sold out performances", () => {
    const params = testData.createMinimalCourseRequestEvent();
    params.soldOutPerformances = [{ date: "2017-01-20", at: "18:00" }];

    expect(() => validator.validateCreateOrUpdateEventRequest(params)).toThrow(
      "[400] Bad Request: Can only have sold out performances if event is a performance"
    );
  });
});