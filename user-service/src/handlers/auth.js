"use strict";

const jwt = require("jsonwebtoken");
const log = require("loglevel");

// Policy helper function
const generatePolicy = principalId => {
  const authResponse = {
    principalId: principalId
  };

  // TODO add in environment.

  // 'arn:aws:execute-api:eu-west-1:random-account-id:random-api-id/development/PUT/dinosaurs/xx';

  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      generatePolicyStatement(
        process.env.EXECUTE_API_ID +
          "/" +
          process.env.SERVERLESS_STAGE +
          "/GET/user"
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID +
          "/" +
          process.env.SERVERLESS_STAGE +
          "/DELETE/user"
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID +
          "/" +
          process.env.SERVERLESS_STAGE +
          "/OPTIONS/user"
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID +
          "/" +
          process.env.SERVERLESS_STAGE +
          "/GET/user/watches/*"
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID +
          "/" +
          process.env.SERVERLESS_STAGE +
          "/PUT/user/watches/*"
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID +
          "/" +
          process.env.SERVERLESS_STAGE +
          "/OPTIONS/user/watches/*"
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID +
          "/" +
          process.env.SERVERLESS_STAGE +
          "/GET/user/preferences"
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID +
          "/" +
          process.env.SERVERLESS_STAGE +
          "/PUT/user/preferences"
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID +
          "/" +
          process.env.SERVERLESS_STAGE +
          "/OPTIONS/user/preferences"
      )
    ]
  };

  authResponse.policyDocument = policyDocument;
  return authResponse;
};

function generatePolicyStatement(resource) {
  return {
    Action: "execute-api:Invoke",
    Effect: "Allow",
    Resource: resource
  };
}

// TODO Hopefully API Gateway will sometime support passing the authorization
// token as a query string parameter, in order to avoid a preflight request.

module.exports.handler = (event, context, cb) => {
  try {
    if (event.authorizationToken) {
      // remove "Bearer " from token
      const token = event.authorizationToken.substring(7);

      const options = {
        audience: process.env.AUTH0_CLIENT_ID
      };

      console.log("token!", token);
      console.log(
        "values",
        process.env.AUTH0_CLIENT_SECRET,
        process.env.AUTH0_CLIENT_ID,
        process.env.SERVERLESS_STAGE
      );

      jwt.verify(
        token,
        new Buffer(process.env.AUTH0_CLIENT_SECRET, "base64"),
        options,
        (err, decoded) => {
          if (err) {
            console.log("err in callback", err.message);
            cb("Unauthorized");
          } else {
            const policy = generatePolicy(
              decoded.sub,
              "Allow",
              event.methodArn
            );
            console.log(
              "policy>>>",
              policy.policyDocument.Statement[0],
              JSON.stringify(policy)
            );
            cb(null, policy);
          }
        }
      );
    } else {
      cb("Unauthorized");
    }
  } catch (err) {
    console.log("err!!", err.message);
    log.error(err.message);
    cb("Unauthorized");
  }
};
