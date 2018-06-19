import * as testData from "../test-data";
import * as validator from "./validator";

it("should pass fully populated venue", () => {
  const params = testData.createFullRequestVenue();
  expect(() => validator.validateCreateVenueRequest(params)).not.toThrow();
});

it("should pass minimally populated venue", () => {
  const params = testData.createMinimalRequestVenue();
  expect(() => validator.validateCreateVenueRequest(params)).not.toThrow();
});

it("should fail venue with missing name", () => {
  const params = testData.createMinimalRequestVenue();
  delete params.name;
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Name can't be blank"
  );
});

it("should fail venue with missing status", () => {
  const params = testData.createMinimalRequestVenue();
  delete params.status;
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Status can't be blank"
  );
});

it("should fail venue with missing venue type", () => {
  const params = testData.createMinimalRequestVenue();
  delete params.venueType;
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Venue Type can't be blank"
  );
});

it("should not fail venue with missing description", () => {
  const params = testData.createMinimalRequestVenue();
  delete params.description;
  expect(() => validator.validateCreateVenueRequest(params)).not.toThrow();
});

it("should fail venue with missing address", () => {
  const params = testData.createMinimalRequestVenue();
  delete params.address;
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Address can't be blank"
  );
});

it("should fail venue with missing postcode", () => {
  const params = testData.createMinimalRequestVenue();
  delete params.postcode;
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Postcode can't be blank"
  );
});

it("should fail venue with missing has permanent collection flag", () => {
  const params = testData.createMinimalRequestVenue();
  delete params.hasPermanentCollection;
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Has Permanent Collection can't be blank"
  );
});

it("should fail venue with invalid longitude", () => {
  const params = testData.createMinimalRequestVenue();
  params.longitude = 90;
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Longitude is not less than or equal to 0.7278"
  );
});

it("should fail venue with invalid latitude", () => {
  const params = testData.createMinimalRequestVenue();
  params.latitude = 90;
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Latitude is not less than or equal to 51.807399999999994"
  );
});

it("should fail venue with missing wheelchair access type", () => {
  const params = testData.createMinimalRequestVenue();
  delete params.wheelchairAccessType;
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Wheelchair Access Type can't be blank"
  );
});

it("should fail venue with missing disabled bathroom type", () => {
  const params = testData.createMinimalRequestVenue();
  delete params.disabledBathroomType;
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Disabled Bathroom Type can't be blank"
  );
});

it("should fail venue with missing hearing facilities type", () => {
  const params = testData.createMinimalRequestVenue();
  delete params.hearingFacilitiesType;
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Hearing Facilities Type can't be blank"
  );
});

it("should fail venue with invalid email", () => {
  const params = testData.createMinimalRequestVenue();
  params.email = "foo";
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Email is not a valid email"
  );
});

it("should fail venue with invalid telephone", () => {
  const params = testData.createMinimalRequestVenue();
  params.telephone = "foo";
  expect(() => validator.validateCreateVenueRequest(params)).toThrow(
    "[400] Bad Request: Telephone is in the wrong format"
  );
});
