import jwt from "jsonwebtoken";
import * as log from "loglevel";

function generatePolicy(principalId) {
  const authResponse = {
    principalId: principalId
  };

  const prefix =
    process.env.EXECUTE_API_ID + "/" + process.env.SERVERLESS_STAGE;

  authResponse.policyDocument = {
    Version: "2012-10-17",
    Statement: [
      generatePolicyStatement(prefix + "/GET/user"),
      generatePolicyStatement(prefix + "/DELETE/user"),
      generatePolicyStatement(prefix + "/OPTIONS/user"),
      generatePolicyStatement(prefix + "/GET/user/watches/*"),
      generatePolicyStatement(prefix + "/PUT/user/watches/*"),
      generatePolicyStatement(prefix + "/OPTIONS/user/watches/*"),
      generatePolicyStatement(prefix + "/GET/user/preferences"),
      generatePolicyStatement(prefix + "/PUT/user/preferences"),
      generatePolicyStatement(prefix + "/OPTIONS/user/preferences")
    ]
  };

  return authResponse;
}

function generatePolicyStatement(resource) {
  return {
    Action: "execute-api:Invoke",
    Effect: "Allow",
    Resource: resource
  };
}

// TODO Hopefully API Gateway will sometime support passing the authorization
// token as a query string parameter, in order to avoid a preflight request.
// TODO Regarding the above, see if this is what I need:
// https://aws.amazon.com/blogs/compute/using-enhanced-request-authorizers-in-amazon-api-gateway/

export function handler(event, context, cb) {
  try {
    if (event.authorizationToken) {
      // remove "Bearer " from token
      const token = event.authorizationToken.substring(7);

      const options = {
        audience: process.env.AUTH0_CLIENT_ID
      };

      jwt.verify(
        token,
        new Buffer(process.env.AUTH0_CLIENT_SECRET, "base64"),
        options,
        (err, decoded) => {
          if (err) {
            cb("Unauthorized");
          } else {
            const policy = generatePolicy(
              decoded.sub,
              "Allow",
              event.methodArn
            );
            cb(null, policy);
          }
        }
      );
    } else {
      cb("Unauthorized");
    }
  } catch (err) {
    log.error(err.message);
    cb("Unauthorized");
  }
}
