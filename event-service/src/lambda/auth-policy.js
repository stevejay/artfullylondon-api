import AuthPolicy from "aws-auth-policy";

function getResourceInfoFromMethodArn(methodArn) {
  if (!methodArn) {
    throw new Error("methodArn not found");
  }
  const arnParts = methodArn.split(":");
  const apiGatewayParts = arnParts[5].split("/");
  return {
    accountId: arnParts[4],
    region: arnParts[3],
    restApiId: apiGatewayParts[0],
    stage: apiGatewayParts[1],
    method: apiGatewayParts[2]
  };
}

export default class extends AuthPolicy {
  constructor(principalId, methodArn) {
    const resourceInfo = getResourceInfoFromMethodArn(methodArn);
    super(principalId, resourceInfo.accountId, {
      region: resourceInfo.region,
      restApiId: resourceInfo.restApiId,
      stage: resourceInfo.stage
    });
  }
}
