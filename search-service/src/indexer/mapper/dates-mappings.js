import addDays from "date-fns/addDays";
import startOfDay from "date-fns/startOfDay";
import * as eventDatesGenerator from "./event-dates-generator";
import * as namedClosuresLookup from "../named-closures-lookup";
import * as timeUtils from "../../time-utils";

export function mapDates(event) {
  const dayStart = startOfDay(timeUtils.getUtcNow());
  return eventDatesGenerator.generate(
    event,
    dayStart,
    addDays(dayStart, 370),
    namedClosuresLookup.get()
  );
}
