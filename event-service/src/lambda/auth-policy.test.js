import AuthPolicy from "./auth-policy";

describe("AuthPolicy", () => {
  it("should create a valid policy", () => {
    const authPolicy = new AuthPolicy(
      "some-principal-id",
      "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/GET/foo"
    );
    authPolicy.allowMethod(AuthPolicy.HttpVerb.ALL, "/*");
    const policy = authPolicy.build();
    expect(policy).toEqual({
      principalId: "some-principal-id",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: [
              "arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/*/*"
            ]
          }
        ]
      }
    });
  });
});
