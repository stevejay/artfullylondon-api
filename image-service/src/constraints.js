const constants = require('./constants');

exports.image = {
  type: {
    inclusion: constants.ALLOWED_IMAGE_TYPES,
  },
  id: {
    uuid: true,
    presence: true,
  },
  url: {
    url: true,
    length: { maximum: 400 },
  },
};
