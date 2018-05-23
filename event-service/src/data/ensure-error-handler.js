'use strict';

module.exports = (exports = errors => {
  throw new Error('[400] Bad Request: ' + errors.join('; '));
});
