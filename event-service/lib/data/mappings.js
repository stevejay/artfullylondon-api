'use strict';

const latinize = require('latinize');

exports.hasLength = array => {
  return !!array && !!array.length;
};

exports.mapRequestReviewsToDbItem = (reviews, result) => {
  if (reviews && reviews.length) {
    result.reviews = reviews.map(review => ({
      source: review.source,
      rating: review.rating,
    }));
  }

  return result;
};

exports.mapRequestImagesToDbItem = (images, result) => {
  if (images && images.length) {
    result.images = images.map(image => {
      const mapped = { id: image.id, ratio: image.ratio };
      if (image.copyright) {
        mapped.copyright = image.copyright;
      }
      if (image.dominantColor) {
        mapped.dominantColor = image.dominantColor;
      }
      return mapped;
    });
  }

  return result;
};

exports.mapMainImage = (images, result) => {
  const mainImage = images && images.length ? images[0] : null;

  if (mainImage) {
    result.image = mainImage.id;

    if (mainImage.copyright) {
      result.imageCopyright = mainImage.copyright;
    }

    if (mainImage.ratio) {
      result.imageRatio = mainImage.ratio;
    }

    if (mainImage.dominantColor) {
      result.imageColor = mainImage.dominantColor;
    }
  }

  return result;
};

exports.mapRequestLinksToDbItem = (links, result) => {
  if (links && links.length) {
    result.links = links.map(link => ({
      type: link.type,
      url: link.url,
    }));
  }

  return result;
};

exports.mapRequestOpeningTimesToDbItem = (openingTimes, result) => {
  if (openingTimes && openingTimes.length) {
    result.openingTimes = openingTimes.map(openingTime => {
      const result = {
        day: openingTime.day,
        from: openingTime.from,
        to: openingTime.to,
      };

      if (openingTime.timesRangeId) {
        result.timesRangeId = openingTime.timesRangeId;
      }

      return result;
    });
  }

  return result;
};

exports.mapRequestAdditionalOpeningTimesToDbItem = (
  additionalOpeningTimes,
  result
) => {
  if (additionalOpeningTimes && additionalOpeningTimes.length) {
    result.additionalOpeningTimes = additionalOpeningTimes.map(additional => ({
      date: additional.date,
      from: additional.from,
      to: additional.to,
    }));
  }

  return result;
};

exports.mapRequestOpeningTimesClosuresToDbItem = (
  openingTimesClosures,
  result
) => {
  if (openingTimesClosures && openingTimesClosures.length) {
    result.openingTimesClosures = openingTimesClosures.map(closure => {
      const mapped = {
        date: closure.date,
      };

      if (closure.from) {
        mapped.from = closure.from;
        mapped.to = closure.to;
      }

      return mapped;
    });
  }
};

exports.mapRequestPerformancesClosuresToDbItem = (
  performancesClosures,
  result
) => {
  if (performancesClosures && performancesClosures.length) {
    result.performancesClosures = performancesClosures.map(closure => {
      const mapped = {
        date: closure.date,
      };

      if (closure.at) {
        mapped.at = closure.at;
      }

      return mapped;
    });
  }
};

exports.mapRequestNamedClosuresToDbItem = (namedClosures, result) => {
  if (namedClosures && namedClosures.length) {
    result.namedClosures = exports.mapRequestPrimitivesArrayToDbItem(
      namedClosures
    );
  }
};

exports.mapRequestSpecialOpeningTimesToDbItem = (
  specialOpeningTimes,
  result
) => {
  if (specialOpeningTimes && specialOpeningTimes.length) {
    result.specialOpeningTimes = specialOpeningTimes.map(special => {
      const mapped = {
        date: special.date,
        from: special.from,
        to: special.to,
      };

      _mapRequestAudienceTagsToDbItemForEvent(special.audienceTags, mapped);
      return mapped;
    });
  }

  return result;
};

exports.mapRequestPerformancesToDbItem = (performances, result) => {
  if (performances && performances.length) {
    result.performances = performances.map(performance => {
      const result = {
        day: performance.day,
        at: performance.at,
      };

      if (performance.timesRangeId) {
        result.timesRangeId = performance.timesRangeId;
      }

      return result;
    });
  }

  return result;
};

exports.mapRequestAdditionalPerformancesToDbItem = (
  additionalPerformances,
  result
) => {
  if (additionalPerformances && additionalPerformances.length) {
    result.additionalPerformances = additionalPerformances.map(additional => ({
      date: additional.date,
      at: additional.at,
    }));
  }

  return result;
};

exports.mapRequestSpecialPerformancesToDbItem = (
  specialPerformances,
  result
) => {
  if (specialPerformances && specialPerformances.length) {
    result.specialPerformances = specialPerformances.map(special => {
      const mapped = {
        date: special.date,
        at: special.at,
      };

      _mapRequestAudienceTagsToDbItemForEvent(special.audienceTags, mapped);
      return mapped;
    });
  }

  return result;
};

exports.mapRequestTagsToDbItem = tags => {
  return tags && tags.length
    ? tags.map(tag => ({ id: tag.id, label: tag.label }))
    : undefined;
};

exports.mapRequestTimesRangesToDbItem = (timesRanges, result) => {
  if (timesRanges && timesRanges.length) {
    result.timesRanges = timesRanges.map(timesRange => {
      const result = {
        id: timesRange.id,
        label: timesRange.label,
        dateFrom: timesRange.dateFrom,
        dateTo: timesRange.dateTo,
      };

      return result;
    });
  }
};

exports.mapRequestSoldOutPerformancesToDbItem = (
  soldOutPerformances,
  result
) => {
  if (soldOutPerformances && soldOutPerformances.length) {
    result.soldOutPerformances = soldOutPerformances.map(soldOutPerformance => {
      const result = {
        date: soldOutPerformance.date,
        at: soldOutPerformance.at,
      };

      return result;
    });
  }
};

exports.mapRequestTalentsToDbItem = (talents, result) => {
  if (talents && talents.length) {
    result.talents = talents.map(talent => {
      const result = {
        id: talent.id,
        roles: exports.mapRequestPrimitivesArrayToDbItem(talent.roles),
      };

      const characters = exports.mapRequestPrimitivesArrayToDbItem(
        talent.characters
      );
      if (characters) {
        result.characters = characters;
      }

      return result;
    });
  }

  return result;
};

exports.mapRequestPrimitivesArrayToDbItem = array => {
  return array && array.length ? array : undefined;
};

function _mapRequestAudienceTagsToDbItemForEvent(audienceTags, result) {
  if (audienceTags && audienceTags.length) {
    result.audienceTags = audienceTags.map(tag => ({
      id: tag.id,
      label: tag.label,
    }));
  }

  return result;
}

const POSTCODE_DISTRICT_REGEX = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?/;

exports.getPostcodeDistrict = postcode => {
  var matches = (postcode || '').match(POSTCODE_DISTRICT_REGEX);
  return matches ? matches[0] : undefined;
};

const COMMON_START_WORDS_WORDS_REGEX = /^(?:the|a)\s+/i;

exports.mapNameToSortName = name => {
  if (!name) {
    return name;
  }

  let result = latinize(name || '').toLowerCase();
  return result.replace(COMMON_START_WORDS_WORDS_REGEX, ' ').trim();
};

const GENERIC_START_WORD_REGEX = /^(theatre|gallery)\s+/i;

exports.removeCommonStartWords = name => {
  return name
    .replace(COMMON_START_WORDS_WORDS_REGEX, '')
    .replace(GENERIC_START_WORD_REGEX, '');
};
