import _ from "lodash";
import moment from "moment";
import * as namedClosureType from "../types/named-closure-type";
import * as time from "../time";

const MONDAY = 1;
const SATURDAY = 6;

export function generate(seedData, dateFrom, dateTo) {
  const years = _.range(dateFrom.year(), dateTo.year() + 1);
  const augustDayStrs = _.range(1, 32).map(day => _.padStart(day, 2, "0"));

  return {
    ...createEntryForType(
      namedClosureType.BANK_HOLIDAYS,
      seedData[namedClosureType.BANK_HOLIDAYS]
    ),
    ...createEntryForType(
      namedClosureType.BANK_HOLIDAY_WEEKENDS,
      _.sortedUniq(
        _
          .flatten(
            seedData[namedClosureType.BANK_HOLIDAYS].map(bankHoliday => {
              const result = [bankHoliday];
              if (moment(bankHoliday).isoWeekday() === MONDAY) {
                result.push(
                  moment(bankHoliday)
                    .add(-2, "days")
                    .format(time.DATE_FORMAT)
                );
                result.push(
                  moment(bankHoliday)
                    .add(-1, "days")
                    .format(time.DATE_FORMAT)
                );
              }
              return result;
            })
          )
          .sort()
      )
    ),
    ...createEntryForType(
      namedClosureType.CHRISTMAS_EVE,
      _.map(years, year => `${year}-12-24`)
    ),
    ...createEntryForType(
      namedClosureType.CHRISTMAS_DAY,
      _.map(years, year => `${year}-12-25`)
    ),
    ...createEntryForType(
      namedClosureType.BOXING_DAY,
      _.map(years, year => `${year}-12-26`)
    ),
    ...createEntryForType(
      namedClosureType.NEW_YEARS_EVE,
      _.map(years, year => `${year}-12-31`)
    ),
    ...createEntryForType(
      namedClosureType.NEW_YEARS_DAY,
      _.map(years, year => `${year}-01-01`)
    ),
    ...createEntryForType(
      namedClosureType.CHRISTMAS_PERIOD,
      _.flatten(
        years.map(year => [
          `${year}-12-24`,
          `${year}-12-25`,
          `${year}-12-26`,
          `${year}-12-27`,
          `${year}-12-28`,
          `${year}-12-29`,
          `${year}-12-30`,
          `${year}-12-31`,
          `${year + 1}-01-01`
        ])
      )
    ),
    ...createEntryForType(
      namedClosureType.EASTER_SUNDAY,
      seedData[namedClosureType.EASTER_SUNDAY]
    ),
    ...createEntryForType(
      namedClosureType.EASTER_HOLIDAY_PERIOD,
      _.flatten(
        seedData[namedClosureType.EASTER_SUNDAY].map(sunday => [
          moment(sunday)
            .add(-2, "days")
            .format(time.DATE_FORMAT),
          moment(sunday)
            .add(-1, "days")
            .format(time.DATE_FORMAT),
          moment(sunday).format(time.DATE_FORMAT),
          moment(sunday)
            .add(1, "days")
            .format(time.DATE_FORMAT)
        ])
      )
    ),
    ...createEntryForType(
      namedClosureType.AUGUST_SATURDAYS,
      _.flatten(
        years.map(year =>
          augustDayStrs
            .map(day => `${year}-08-${day}`)
            .filter(date => moment(date).isoWeekday() === SATURDAY)
        )
      )
    ),
    ...createEntryForType(
      namedClosureType.AUGUST,
      _.flatten(
        years.map(year => augustDayStrs.map(day => `${year}-08-${day}`))
      )
    ),
    ...createEntryForType(
      namedClosureType.ROSH_HASHANAH,
      seedData[namedClosureType.ROSH_HASHANAH]
    ),
    ...createEntryForType(
      namedClosureType.YOM_KIPPUR,
      seedData[namedClosureType.YOM_KIPPUR]
    )
  };
}

function createEntryForType(key, dates) {
  return {
    [key]: {
      label: _.startCase(key),
      dates
    }
  };
}
