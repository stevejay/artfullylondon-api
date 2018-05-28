"use strict";

const emailService = require("./email-service");
const ses = require("../external-services/ses");
const venueEventMonitorRepository = require("../persistence/venue-event-monitor-repository");
const venueMonitorRepository = require("../persistence/venue-monitor-repository");
const lambda = require("../external-services/lambda");
const constants = require("../constants");

process.env.SERVERLESS_GET_LATEST_ITERATION_ERRORS_LAMBDA_NAME =
  "GetLatestIterationErrors";

describe("email-service", () => {
  describe("sendMonitorStatusEmail", () => {
    it("should process a valid request", async () => {
      venueEventMonitorRepository.getNewOrChanged = jest
        .fn()
        .mockResolvedValue([
          { venueId: "almeida-theatre" },
          { venueId: "almeida-theatre" },
          { venueId: "tate-modern" }
        ]);

      venueMonitorRepository.getChanged = jest
        .fn()
        .mockResolvedValue([
          { venueId: "park-theatre" },
          { venueId: "park-theatre" },
          { venueId: "tate-britain" }
        ]);

      lambda.invoke = jest.fn().mockResolvedValue({
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify({
          errors: [{ entityId: "bloomsbury", message: "Some error" }]
        })
      });

      ses.sendEmail = jest.fn().mockResolvedValue();

      await emailService.sendMonitorStatusEmail();

      expect(lambda.invoke).toHaveBeenCalledWith("GetLatestIterationErrors", {
        actionId: constants.ITERATE_VENUES_ACTION_ID
      });

      expect(ses.sendEmail).toHaveBeenCalledWith({
        Destination: {
          ToAddresses: ["steve@stevejay.net"]
        },
        Message: {
          Body: {
            Text: {
              Data:
                "Changed or New Events:\n\nalmeida-theatre\ntate-modern\n\nChanged Venue Data:\n\npark-theatre\ntate-britain\n\nLatest Errors:\n\nbloomsbury: Some error"
            }
          },
          Subject: {
            Data: "Venue Monitor Email"
          }
        },
        Source: "support@artfully.london"
      });
    });
  });
});
