'use strict';

const jwt = require('jsonwebtoken');
const log = require('loglevel');

// Policy helper function
const generatePolicy = principalId => {
  const authResponse = {
    principalId: principalId,
  };

  // TODO add in environment.

  const policyDocument = {
    Version: '2012-10-17',
    Statement: [
      generatePolicyStatement(
        process.env.EXECUTE_API_ID + '/*/GET/user'
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID + '/*/DELETE/user'
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID + '/*/OPTIONS/user'
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID + '/*/GET/user/watches/*'
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID + '/*/PUT/user/watches/*'
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID + '/*/OPTIONS/user/watches/*'
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID + '/*/GET/user/preferences'
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID + '/*/PUT/user/preferences'
      ),
      generatePolicyStatement(
        process.env.EXECUTE_API_ID + '/*/OPTIONS/user/preferences'
      ),
    ],
  };

  authResponse.policyDocument = policyDocument;
  return authResponse;
};

function generatePolicyStatement(resource) {
  return {
    Action: 'execute-api:Invoke',
    Effect: 'Allow',
    Resource: resource,
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
        audience: process.env.AUTH0_CLIENT_ID,
      };

      jwt.verify(
        token,
        new Buffer(process.env.AUTH0_CLIENT_SECRET, 'base64'),
        options,
        (err, decoded) => {
          if (err) {
            cb('Unauthorized');
          } else {
            cb(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
          }
        }
      );
    } else {
      cb('Unauthorized');
    }
  } catch (err) {
    log.error(err.message);
    cb('Unauthorized');
  }
};
