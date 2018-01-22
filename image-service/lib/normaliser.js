'use strict';

module.exports = {
  type: {
    toLowerCase: true,
  },
  id: {
    replace: { pattern: /-/g, newSubStr: '' },
  },
};
