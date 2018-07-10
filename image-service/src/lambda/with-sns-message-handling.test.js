import withSnsMessageHandling from "./with-sns-message-handling";

describe("withSnsMessageHandling", () => {
  it("should handle a success", done => {
    const handler = withSnsMessageHandling(async () => {
      return "success";
    });
    handler(
      { Records: [{ Sns: { Message: '{"foo":"bar"}' } }] },
      null,
      (err, response) => {
        if (err) {
          done.fail(`Error thrown: ${err.message}`);
        } else {
          if (response && response.ok) {
            done();
          } else {
            done.fail(`Wrong return value: ${JSON.stringify(response)}`);
          }
        }
      }
    );
  });

  it("should handle a failure", done => {
    const handler = withSnsMessageHandling(async () => {
      throw new Error("deliberately thrown");
    });
    handler({ Records: [{ Sns: { Message: '{"foo":"bar"}' } }] }, null, err => {
      if (err) {
        if (/deliberately thrown/.test(err.message)) {
          done();
        } else {
          done.fail(`Wrong error thrown: ${err.message}`);
        }
      } else {
        done.fail("Should have thrown an error");
      }
    });
  });
});
