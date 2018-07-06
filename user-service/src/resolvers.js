import * as userService from "./user-service";
import * as preferenceService from "./preference-service";
import * as watchService from "./watch-service";
import * as watchType from "./watch-type";

export default {
  Query: {
    async preferences(__, ___, context) {
      return await preferenceService.getPreferences({
        userId: context.authorizer.principalId
      });
    },
    // TODO make a single call to the db.
    watches: (__, ___, context, info) => {
      console.log("INFO", JSON.stringify(info));

      return {
        async tag() {
          return await watchService.getWatches({
            userId: context.authorizer.principalId,
            watchType: watchType.TAG
          });
        },
        async event() {
          return await watchService.getWatches({
            userId: context.authorizer.principalId,
            watchType: watchType.EVENT
          });
        },
        async eventSeries() {
          return await watchService.getWatches({
            userId: context.authorizer.principalId,
            watchType: watchType.EVENT_SERIES
          });
        },
        async talent() {
          return await watchService.getWatches({
            userId: context.authorizer.principalId,
            watchType: watchType.TALENT
          });
        },
        async venue() {
          return await watchService.getWatches({
            userId: context.authorizer.principalId,
            watchType: watchType.VENUE
          });
        }
      };
    }
  },
  Mutation: {
    async deleteUser(__, ___, context) {
      await userService.deleteUser({ userId: context.authorizer.principalId });
      return { ok: true };
    },
    async updateWatches(__, request, context) {
      const updatedWatches = await watchService.updateWatches({
        ...request.input,
        userId: context.authorizer.principalId
      });
      return { watches: updatedWatches };
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
