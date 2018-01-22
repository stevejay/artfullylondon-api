'use strict';

const snsPublish = require('aws-sns-publish');

module.exports = (exports = {
  notify: (body, headers) => snsPublish(body, headers),
});
