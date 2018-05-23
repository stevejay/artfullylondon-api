'use strict';

const co = require('co');
const imageService = require('../lib/services/image-service');

exports.handler = (event, context, cb) => {
  co(function*() {
    yield (event.Records || []).map(record => processRecord(record));
  })
    .then(() => cb(null, { acknowledged: true }))
    .catch(cb);
};

function* processRecord(record) {
  const message = JSON.parse(record.Sns.Message);

  if (!message) {
    return;
  }

  yield imageService.reprocessNextImage(
    message.lastId,
    message.startTimestamp
  );
}
