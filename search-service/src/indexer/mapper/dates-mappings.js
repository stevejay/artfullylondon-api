import moment from "moment";
import * as eventDatesGenerator from "./event-dates-generator";
import * as namedClosuresLookup from "../named-closures-lookup";

export function mapDates(event) {
  return eventDatesGenerator.generate(
    event,
    moment().startOf("day"),
    moment()
      .startOf("day")
      .add(370, "days"),
    namedClosuresLookup.get()
  );
}
