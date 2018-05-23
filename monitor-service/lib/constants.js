'use strict';

const path = require('path');

exports.PHANTOMJS_BIN_PATH = path.resolve(
  process.env.LAMBDA_TASK_ROOT ||
    './node_modules/phantomjs-prebuilt/lib/phantom/bin',
  'phantomjs'
);

exports.ITERATE_VENUES_ACTION_ID = 'IterateVenueMonitors';
