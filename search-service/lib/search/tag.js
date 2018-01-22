'use strict';

exports.createTagIdForMediumWithStyleTag = function(mediumTagId, styleTagId) {
  const styleId = styleTagId.slice(5); // removes initial 'style' text
  return mediumTagId + styleId;
};
