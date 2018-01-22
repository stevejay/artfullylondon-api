'use strict';

exports.IMAGE_TYPE_EVENT = 'event';
exports.IMAGE_TYPE_EVENT_SERIES = 'event-series';
exports.IMAGE_TYPE_TALENT = 'talent';
exports.IMAGE_TYPE_VENUE = 'venue';

exports.ALLOWED_IMAGE_TYPES = [
  exports.IMAGE_TYPE_EVENT,
  exports.IMAGE_TYPE_EVENT_SERIES,
  exports.IMAGE_TYPE_TALENT,
  exports.IMAGE_TYPE_VENUE,
];

exports.MIN_IMAGE_WIDTH = 450;
exports.MIN_IMAGE_HEIGHT = exports.MIN_IMAGE_WIDTH;
exports.MAX_IMAGE_WIDTH = 6000;
exports.MAX_IMAGE_HEIGHT = exports.MAX_IMAGE_WIDTH;

exports.CURRENT_IMAGE_RESIZE_VERSION = 5;

exports.RESIZE_SIZES = [
  { width: 120, height: 120, suffix: '120x120' },
  { width: 500, height: 500, suffix: '500x500' },
  { width: 500, height: 350, suffix: '500x350' },
  { width: 750, suffix: '750x' },
];

exports.ITERATE_IMAGES_ACTION_ID = 'IterateImages';
