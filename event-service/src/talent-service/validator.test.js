import * as testData from "../../tests/utils/test-data";
import * as validator from "./validator";

it("should pass a fully populated individual talent", () => {
  const params = testData.createFullIndividualRequestTalent();
  expect(() =>
    validator.validateCreateOrUpdateTalentRequest(params)
  ).not.toThrow();
});

it("should pass a minimally populated individual talent", () => {
  const params = testData.createMinimalIndividualRequestTalent();
  expect(() =>
    validator.validateCreateOrUpdateTalentRequest(params)
  ).not.toThrow();
});

it("should pass a fully populated group talent", () => {
  const params = testData.createFullGroupRequestTalent();
  expect(() =>
    validator.validateCreateOrUpdateTalentRequest(params)
  ).not.toThrow();
});

it("should pass a minimally populated group talent", () => {
  const params = testData.createMinimalGroupRequestTalent();
  expect(() =>
    validator.validateCreateOrUpdateTalentRequest(params)
  ).not.toThrow();
});

it("should fail a group talent with first names", () => {
  const params = testData.createMinimalGroupRequestTalent();
  params.firstNames = "Steve";
  expect(() => validator.validateCreateOrUpdateTalentRequest(params)).toThrow(
    "[400] Bad Request: first names should be blank for group talent"
  );
});
