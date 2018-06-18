import { ensure } from "ensure-request";
import * as emailFrequencyType from "./email-frequency-type";
import * as watchChangeType from "./watch-change-type";
import * as entityType from "./entity-type";

export const MAX_WATCHES_LENGTH = 200;

const ENTITY_TYPE_CONSTRAINT = {
  presence: true,
  inclusion: entityType.ALLOWED_VALUES
};

const UPDATE_PREFERENCES_CONSTRAINT = {
  preferences: {
    object: {
      emailFrequency: {
        presence: true,
        inclusion: emailFrequencyType.ALLOWED_VALUES
      }
    }
  }
};

const UPDATE_WATCHES_CONSTRAINT = {
  entityType: ENTITY_TYPE_CONSTRAINT,
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
            ensure: (_, attrs) => !!attrs.label && attrs.created > 0,
            message:
              'label and created cannot be blank when changeType is "add"'
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
        },
        created: {
          number: true,
          numericality: { onlyInteger: true, greaterThan: 0 }
        }
      }
    }
  }
};

const GET_WATCHES_CONSTRAINT = { entityType: ENTITY_TYPE_CONSTRAINT };

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateGetWatchesRequest(request) {
  ensure(request, GET_WATCHES_CONSTRAINT, errorHandler);
}

export function validateUpdatePreferencesRequest(request) {
  ensure(request, UPDATE_PREFERENCES_CONSTRAINT, errorHandler);
}

export function validateUpdateWatchesRequest(request) {
  ensure(request, UPDATE_WATCHES_CONSTRAINT, errorHandler);
}
