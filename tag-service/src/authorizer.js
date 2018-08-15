export function checkUserIsAuthorizedForMutation(context) {
  if (context.authorizer.isEditor !== "true") {
    throw new Error("[401] User not authorized for requested action");
  }
}
