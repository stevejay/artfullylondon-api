import { ensure } from "ensure-request";
import * as watchChangeType from "./watch-change-type";
import * as watchType from "./watch-type";

export const MAX_WATCHES_LENGTH = 200;

const UPDATE_WATCHES_CONSTRAINT = {
  watchType: {
    presence: true,
    inclusion: watchType.ALLOWED_VALUES
  },
  newVersion: {
    presence: true,
    number: true,
    numericality: { onlyInteger: true, greaterThan: 0 }
  },
  changes: {
    presence: true,
    array: true,
    length: MAX_WATCHES_LENGTH,
    each: {
      object: {
        changeType: {
          presence: true,
          inclusion: watchChangeType.ALLOWED_VALUES,
          dependency: {
            test: value => value === watchChangeType.ADD,
            ensure: (_, attrs) => !!attrs.label,
            message: 'label cannot be blank when changeType is "ADD"'
          }
        },
        id: {
          presence: true,
          string: true,
          length: { minimum: 1, maximum: 300 }
        },
        label: {
          string: true,
          length: { minimum: 1, maximum: 300 }
        }
      }
    }
  }
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateUpdateWatchesRequest(request) {
  ensure(request, UPDATE_WATCHES_CONSTRAINT, errorHandler);
}
