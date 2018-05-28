'use strict';



module.exports = exports = handler => (event, context, cb) =>
  co(function*() {
    const result = yield handler(event);
    cb(null, result);
  }).catch(cb);
