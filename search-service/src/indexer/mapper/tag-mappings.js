import _ from "lodash";
import * as artsType from "../../types/arts-type";
import * as mediumType from "../../types/medium-type";
import * as eventType from "../../types/event-type";

export function mapArtsType(event) {
  if (event.mediumTags && event.mediumTags.length) {
    const mediumTagIds = event.mediumTags.map(tag => tag.id);

    if (_.intersection(mediumTagIds, mediumType.VISUAL_ARTS).length) {
      return artsType.VISUAL;
    }

    if (_.intersection(mediumTagIds, mediumType.PERFORMING_ARTS).length) {
      return artsType.PERFORMING;
    }

    if (_.intersection(mediumTagIds, mediumType.CREATIVE_WRITING).length) {
      return artsType.CREATIVE_WRITING;
    }
  }

  // use event type as a last resort
  if (event.eventType === eventType.EXHIBITION) {
    return artsType.VISUAL;
  } else {
    return artsType.PERFORMING;
  }
}

export function mapTags(event) {
  return getTagIds(event.geoTags)
    .concat(getTagIds(event.audienceTags))
    .concat(getTagIds(event.mediumTags))
    .concat(
      getTagIds(generateMediumWithStyleTags(event.mediumTags, event.styleTags))
    ); // TODO return undefined if no tags?
}

function getTagIds(tags) {
  return (tags || []).map(tag => tag.id);
}

function generateMediumWithStyleTags(mediumTags, styleTags) {
  const result = [];

  if (!styleTags || !styleTags.length) {
    return result;
  }

  mediumTags.forEach(mediumTag => {
    styleTags.forEach(styleTag => {
      result.push(createMediumWithStyleTag(mediumTag, styleTag));
    });
  });

  return result;
}

function createMediumWithStyleTag(mediumTag, styleTag) {
  const styleId = styleTag.id.slice(5); // remove initial 'style' text
  const newId = mediumTag.id + styleId;
  const newLabel = styleTag.label + " " + mediumTag.label;
  return { id: newId, label: newLabel };
}
