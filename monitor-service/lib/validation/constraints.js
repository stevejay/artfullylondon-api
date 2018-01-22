'use strict';

module.exports.venueEventMonitorConstraint = {
  venueId: {
    presence: true,
    string: true,
  },
  externalEventId: {
    presence: true,
    string: true,
  },
  isIgnored: {
    presence: true,
    bool: true,
  },
  hasChanged: {
    presence: true,
    bool: true,
  },
};

module.exports.venueMonitorConstraint = {
  venueId: {
    presence: true,
    string: true,
  },
  isIgnored: {
    presence: true,
    bool: true,
  },
  hasChanged: {
    presence: true,
    bool: true,
  },
};
