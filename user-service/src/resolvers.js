import * as userService from "./user-service";
import * as preferenceService from "./preference-service";
import * as watchService from "./watch-service";
import * as entityType from "./entity-type";

export default {
  Query: {
    async preferences(__, ___, context) {
      return await preferenceService.getPreferences({
        userId: context.authorizer.principalId
      });
    },
    // TODO make a single call to the db.
    watches: (__, ___, context) => ({
      async tag() {
        return await watchService.getWatches({
          userId: context.authorizer.principalId,
          entityType: entityType.TAG
        });
      },
      async event() {
        return await watchService.getWatches({
          userId: context.authorizer.principalId,
          entityType: entityType.EVENT
        });
      },
      async eventSeries() {
        return await watchService.getWatches({
          userId: context.authorizer.principalId,
          entityType: entityType.EVENT_SERIES
        });
      },
      async talent() {
        return await watchService.getWatches({
          userId: context.authorizer.principalId,
          entityType: entityType.TALENT
        });
      },
      async venue() {
        return await watchService.getWatches({
          userId: context.authorizer.principalId,
          entityType: entityType.VENUE
        });
      }
    })
  },
  Mutation: {
    async deleteUser(__, ___, context) {
      await userService.deleteUser({ userId: context.authorizer.principalId });
      return { ok: true };
    },
    async updateWatches(__, request, context) {
      await watchService.updateWatches({
        ...request.input,
        userId: context.authorizer.principalId
      });
      return { ok: true };
    },
    async updatePreferences(__, request, context) {
      await preferenceService.updatePreferences({
        preferences: request.input,
        userId: context.authorizer.principalId
      });
      return { ok: true };
    }
  }
};
