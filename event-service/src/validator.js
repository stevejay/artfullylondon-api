export function validateUserForMutation(context) {
  if (!context.authorizer.isEditor) {
    throw new Error("[401] User not authorized for requested action");
  }
}
