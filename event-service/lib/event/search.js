'use strict';

const concat = require('lodash.concat');
const sortBy = require('lodash.sortby');
const unionBy = require('lodash.unionby');
const find = require('lodash.find');
const isNil = require('lodash.isnil');
const intersection = require('lodash.intersection');
const tag = require('../entity/tag');
const constants = require('./constants');
const date = require('./date');

exports.mapMediumTagsToArtsType = (mediumTags, eventType) => {
  if (mediumTags && mediumTags.length) {
    const mediumTagIds = mediumTags.map(tag => tag.id);

    if (intersection(mediumTagIds, constants.VISUAL_ARTS_MEDIUMS).length) {
      return constants.ARTS_TYPE_VISUAL;
    }

    if (intersection(mediumTagIds, constants.PERFORMING_ARTS_MEDIUMS).length) {
      return constants.ARTS_TYPE_PERFORMING;
    }

    if (intersection(mediumTagIds, constants.CREATIVE_WRITING_MEDIUMS).length) {
      return constants.ARTS_TYPE_CREATIVE_WRITING;
    }
  }

  // use event type as a last resort
  if (eventType === constants.EVENT_TYPE_EXHIBITION) {
    return constants.ARTS_TYPE_VISUAL;
  } else {
    return constants.ARTS_TYPE_PERFORMING;
  }
};

exports.generateMediumWithStyleTags = (mediumTags, styleTags) => {
  const result = [];

  if (!styleTags || !styleTags.length) {
    return result;
  }

  mediumTags.forEach(mediumTag => {
    styleTags.forEach(styleTag => {
      const newTag = tag.createMediumWithStyleTag(mediumTag, styleTag);
      result.push(newTag);
    });
  });

  return result;
};

exports.createSearchDateObjects = (
  event,
  dateTodayStr,
  dateMaxStr,
  namedClosuresLookup
) => {
  if (event.soldOut) {
    return [];
  }

  const dateRange = exports.getEventDateRange(event, dateTodayStr, dateMaxStr);
  if (!dateRange) {
    return [];
  }

  let dates = exports.createInitialDatesLookup(dateRange);
  if (!dates) {
    return [];
  }

  dates = exports.removeNamedClosuresDates(event, dates, namedClosuresLookup);
  dates = exports.removeFullDayClosureDates(event, dates);
  dates = exports.addRegularTimes(event, dates);
  dates = exports.addAdditionalTimes(event, dates);
  dates = exports.removePartDayClosureDates(event, dates);
  dates = exports.addSpecialDatesTags(event, dates);
  dates = exports.removeSoldOutPerformances(event, dates);

  return exports.convertDatesToList(dates);
};

// Calculates the range of dates we will be creating search dates objects for
exports.getEventDateRange = (event, dateTodayStr, dateMaxStr) => {
  const eventHasRange = event.occurrenceType !==
    constants.OCCURRENCE_TYPE_CONTINUOUS;

  if (!eventHasRange) {
    return { from: dateTodayStr, to: dateMaxStr };
  }

  if (event.dateFrom > dateMaxStr || event.dateTo < dateTodayStr) {
    return null;
  }

  const from = event.dateFrom > dateTodayStr ? event.dateFrom : dateTodayStr;
  const to = event.dateTo < dateMaxStr ? event.dateTo : dateMaxStr;

  return { from, to };
};

exports.createInitialDatesLookup = dateRange => {
  if (isNil(dateRange) || dateRange.to < dateRange.from) {
    return null;
  }

  const loopMoment = date.createMomentFromStringDate(dateRange.from);
  let loopDateStr = null;
  const result = {};

  do {
    loopDateStr = date.createStringDateFromMoment(loopMoment);

    result[loopDateStr] = {
      day: date.getDayNumberFromMoment(loopMoment),
      times: [],
    };

    loopMoment.add(1, 'days');
  } while (loopDateStr < dateRange.to);

  return result;
};

exports.removeNamedClosuresDates = (event, dates, namedClosuresLookup) => {
  const isExhibition = _isExhibitionEvent(event);

  if (!isExhibition || !event.useVenueOpeningTimes) {
    return dates;
  }

  const namedClosures = event.venue.namedClosures;

  if (!namedClosures || namedClosures.length === 0) {
    return dates;
  }

  const result = Object.assign({}, dates);

  namedClosures.forEach(namedClosure => {
    const namedClosureYears = namedClosuresLookup[namedClosure];

    Object.keys(namedClosureYears).forEach(yearKey => {
      const yearDates = namedClosureYears[yearKey];

      yearDates.forEach(date => {
        if (result[date]) {
          delete result[date];
        }
      });
    });
  });

  return result;
};

exports.removeFullDayClosureDates = (event, dates) => {
  const wholeDayClosures = _getClosures(event).filter(
    closure => isNil(closure.from) && isNil(closure.at)
  );

  if (wholeDayClosures.length === 0) {
    return dates;
  }

  const result = Object.assign({}, dates);

  wholeDayClosures.forEach(closure => {
    if (result[closure.date]) {
      delete result[closure.date];
    }
  });

  return result;
};

exports.addRegularTimes = (event, dates) => {
  const isExhibition = _isExhibitionEvent(event);
  let regularTimes = null;
  let timesRanges = null;

  if (isExhibition) {
    if (event.useVenueOpeningTimes) {
      regularTimes = event.venue.openingTimes;
    } else {
      regularTimes = event.openingTimes;
      timesRanges = event.timesRanges;
    }
  } else {
    regularTimes = event.performances;
    timesRanges = event.timesRanges;
  }

  if (!regularTimes || regularTimes.length === 0) {
    return dates;
  }

  const dayLookup = {};

  // Populate the day lookup
  regularTimes.forEach(time => {
    if (!dayLookup[time.day]) {
      dayLookup[time.day] = [];
    }

    const entry = {
      from: time.from || time.at,
      to: time.to || time.at,
      timesRangeId: time.timesRangeId,
    };

    dayLookup[time.day].push(entry);
  });

  const result = Object.assign({}, dates);

  Object.keys(dates).forEach(dateKey => {
    const dateEntry = dates[dateKey];
    const dayTimes = dayLookup[dateEntry.day];

    const activeDayTimes = exports.getActiveDayTimes(
      dayTimes,
      dateKey,
      timesRanges
    );

    if (!activeDayTimes || activeDayTimes.length === 0) {
      return;
    }

    const newDateEntry = Object.assign({}, dateEntry, {
      times: activeDayTimes.map(x => ({ from: x.from, to: x.to })),
    });

    result[dateKey] = newDateEntry;
  });

  return result;
};

exports.getActiveDayTimes = (dayTimes, date, timesRanges) => {
  if (!dayTimes || !dayTimes.length || !timesRanges || !timesRanges.length) {
    return dayTimes;
  }

  const activeTimesRange = find(
    timesRanges,
    timesRange => date >= timesRange.dateFrom && date <= timesRange.dateTo
  );

  if (!activeTimesRange) {
    return [];
  }

  return dayTimes.filter(
    dayTime => dayTime.timesRangeId === activeTimesRange.id
  );
};

exports.addAdditionalTimes = (event, dates) => {
  const isExhibition = _isExhibitionEvent(event);
  let additionalTimes = null;

  if (isExhibition) {
    additionalTimes = event.additionalOpeningTimes || [];

    if (event.useVenueOpeningTimes) {
      let venueAdditionalTimes = event.venue.additionalOpeningTimes;

      if (venueAdditionalTimes && venueAdditionalTimes.length > 0) {
        additionalTimes = _addDateTimeKey(additionalTimes);
        venueAdditionalTimes = _addDateTimeKey(venueAdditionalTimes);

        additionalTimes = unionBy(
          additionalTimes,
          venueAdditionalTimes,
          value => value.key
        );

        additionalTimes = sortBy(additionalTimes, value => value.key);
      }
    }
  } else if (
    event.eventType === constants.EVENT_TYPE_COURSE &&
    event.additionalPerformances.length
  ) {
    additionalTimes = event.additionalPerformances[0];
  } else {
    additionalTimes = event.additionalPerformances;
  }

  if (!additionalTimes || additionalTimes.length === 0) {
    return dates;
  }

  const dateLookup = {};

  // Populate the date lookup
  additionalTimes.forEach(time => {
    if (!dateLookup[time.date]) {
      dateLookup[time.date] = [];
    }

    const entry = {
      from: time.from || time.at,
      to: time.to || time.at,
    };

    dateLookup[time.date].push(entry);
  });

  const result = Object.assign({}, dates);

  Object.keys(dates).forEach(dateKey => {
    const dateEntry = dates[dateKey];
    const dateTimes = dateLookup[dateKey];

    if (!dateTimes || dateTimes.length === 0) {
      return;
    }

    let newTimes = concat(dateEntry.times, dateTimes);
    newTimes = sortBy(newTimes, value => value.from);

    const newDateEntry = Object.assign({}, dateEntry, { times: newTimes });
    result[dateKey] = newDateEntry;
  });

  return result;
};

exports.removePartDayClosureDates = (event, dates) => {
  const isExhibition = _isExhibitionEvent(event);

  const partDayClosures = _getClosures(event).filter(
    closure => !isNil(closure.from) || !isNil(closure.at)
  );

  if (partDayClosures.length === 0) {
    return dates;
  }

  const result = Object.assign({}, dates);

  partDayClosures.forEach(closure => {
    const dateEntry = result[closure.date];

    if (!dateEntry || !dateEntry.times || dateEntry.times.length === 0) {
      return;
    }

    let newTimes = null;

    if (isExhibition) {
      newTimes = dateEntry.times.filter(
        time =>
          time.from > closure.to ||
          time.to < closure.from ||
          !(closure.from <= time.from && closure.to >= time.to)
      );

      newTimes = newTimes.map(time => {
        const newTime = Object.assign({}, time);

        if (closure.from <= time.from && closure.to > time.from) {
          newTime.from = closure.to;
        }

        if (closure.to >= time.to && closure.from < time.to) {
          newTime.to = closure.from;
        }

        return newTime;
      });
    } else {
      newTimes = dateEntry.times.filter(time => time.from !== closure.at);
    }

    const newDateEntry = Object.assign({}, dateEntry, { times: newTimes });
    result[closure.date] = newDateEntry;
  });

  return result;
};

exports.addSpecialDatesTags = (event, dates) => {
  const isExhibition = _isExhibitionEvent(event);

  const specialDates = isExhibition
    ? event.specialOpeningTimes
    : event.specialPerformances;

  if (!specialDates || specialDates.length === 0) {
    return dates;
  }

  const result = Object.assign({}, dates);

  specialDates.forEach(specialDate => {
    const dateResult = result[specialDate.date];

    if (!dateResult || dateResult.times.length === 0) {
      // No dates for this special date
      return;
    }

    const timesIndex = dateResult.times.findIndex(
      time => time.from === (specialDate.from || specialDate.at)
    );

    if (timesIndex === -1) {
      // No matching time
      return;
    }

    const newDate = Object.assign({}, dateResult);
    newDate.times = newDate.times.slice();

    const newTime = Object.assign({}, newDate.times[timesIndex], {
      tags: specialDate.audienceTags.map(tag => tag.id),
    });

    newDate.times.splice(timesIndex, 1, newTime);
    result[specialDate.date] = newDate;
  });

  return result;
};

exports.removeSoldOutPerformances = (event, dates) => {
  const isPerformance = _isPerformanceEvent(event);

  const hasSoldOutPerformances = event.soldOutPerformances &&
    event.soldOutPerformances.length;

  let result = dates;

  if (isPerformance && hasSoldOutPerformances) {
    result = Object.assign({}, dates);

    // TODO make this more efficient (do all date's times at once):

    event.soldOutPerformances.forEach(soldOut => {
      const dateMatch = result[soldOut.date];
      if (!dateMatch) {
        return;
      }

      const timeIndex = dateMatch.times.findIndex(
        match => match.from === soldOut.at
      );

      if (timeIndex === -1) {
        return;
      }

      if (dateMatch.times.length === 1) {
        // We are deleting the only time, so just remove the entire date:
        delete result[soldOut.date];
      } else {
        const newTimes = dateMatch.times.slice();
        newTimes.splice(timeIndex, 1);

        const newDate = Object.assign({}, dateMatch, { times: newTimes });
        result[soldOut.date] = newDate;
      }
    });
  }

  return result;
};

exports.convertDatesToList = dates => {
  const result = [];

  Object.keys(dates).forEach(dateKey => {
    const entry = dates[dateKey];

    entry.times.forEach(time => {
      const resultEntry = {
        date: dateKey,
        from: time.from,
        to: time.to,
      };

      if (time.tags && time.tags.length) {
        resultEntry.tags = time.tags;
      }

      result.push(resultEntry);
    });
  });

  return sortBy(result, value => value.date + '.' + value.from);
};

function _isExhibitionEvent(event) {
  return event.eventType === constants.EVENT_TYPE_EXHIBITION;
}

function _isPerformanceEvent(event) {
  return event.eventType === constants.EVENT_TYPE_PERFORMANCE;
}

function _getClosures(event) {
  const isExhibition = _isExhibitionEvent(event);
  let closures = null;

  if (isExhibition) {
    closures = event.openingTimesClosures || [];

    if (event.useVenueOpeningTimes) {
      closures = concat(closures, event.venue.openingTimesClosures || []);
    }
  } else {
    closures = event.performancesClosures || [];
  }

  return closures;
}

function _addDateTimeKey(times) {
  return times.map(x => {
    x.key = `${x.date}-${x.from}-${x.to}`;
    return x;
  });
}
