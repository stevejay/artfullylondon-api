import _ from "lodash";
import mappr from "mappr";
import * as timeUtils from "../time-utils";

export const mapResponseMainImage = mappr({
  image: "images[0].id",
  imageCopyright: "images[0].copyright",
  imageRatio: "images[0].ratio",
  imageColor: "images[0].dominantColor"
});

export const mapRequestLinks = mappr({
  links: params =>
    _.isEmpty(params.links)
      ? undefined
      : params.links.map(link => _.pick(link, ["type", "url"]))
});

export const mapRequestImages = mappr({
  images: params =>
    _.isEmpty(params.images)
      ? undefined
      : params.images.map(image =>
          _.pick(image, ["id", "ratio", "copyright", "dominantColor"])
        )
});

export const mapRequestEditDates = params => {
  const dateToday = timeUtils.getCreatedDateForDB();
  return {
    createdDate: params.createdDate || dateToday,
    updatedDate: dateToday
  };
};

export function mapOpeningTimes(params) {
  return _.isEmpty(params.openingTimes)
    ? undefined
    : params.openingTimes.map(openingTime =>
        _.pick(openingTime, ["day", "from", "to", "timesRangeId"])
      );
}

export function mapAdditionalOpeningTimes(params) {
  return _.isEmpty(params.additionalOpeningTimes)
    ? undefined
    : params.additionalOpeningTimes.map(additional =>
        _.pick(additional, ["date", "from", "to"])
      );
}

export function mapOpeningTimesClosures(params) {
  return _.isEmpty(params.openingTimesClosures)
    ? undefined
    : params.openingTimesClosures.map(openingTime =>
        _.pick(openingTime, ["date", "from", "to"])
      );
}

export function mapNamedClosures(params) {
  return _.isEmpty(params.namedClosures) ? undefined : params.namedClosures;
}

export function mapTimesRanges(params) {
  return _.isEmpty(params.timesRanges)
    ? undefined
    : params.timesRanges.map(timesRange =>
        _.pick(timesRange, ["id", "label", "dateFrom", "dateTo"])
      );
}

export function mapSpecialOpeningTimes(params) {
  return _.isEmpty(params.specialOpeningTimes)
    ? undefined
    : params.specialOpeningTimes.map(special => ({
        ..._.pick(special, ["date", "from", "to"]),
        audienceTags: mapTags(special.audienceTags)
      }));
}

export function mapAdditionalPerformances(params) {
  return _.isEmpty(params.additionalPerformances)
    ? undefined
    : params.additionalPerformances.map(additional =>
        _.pick(additional, ["date", "at"])
      );
}

export function mapSoldOutPerformances(params) {
  return _.isEmpty(params.soldOutPerformances)
    ? undefined
    : params.soldOutPerformances.map(soldOut =>
        _.pick(soldOut, ["date", "at"])
      );
}

export function mapPerformancesClosures(params) {
  return _.isEmpty(params.performancesClosures)
    ? undefined
    : params.performancesClosures.map(closure =>
        _.pick(closure, ["date", "at"])
      );
}

export function mapSpecialPerformances(params) {
  return _.isEmpty(params.specialPerformances)
    ? undefined
    : params.specialPerformances.map(special => ({
        ..._.pick(special, ["date", "at"]),
        audienceTags: mapTags(special.audienceTags)
      }));
}

export function mapRequestPerformancesToDbItem(params) {
  return _.isEmpty(params.performances)
    ? undefined
    : params.performances.map(performance =>
        _.pick(performance, ["day", "at", "timesRangeId"])
      );
}

export function mapTags(tags) {
  return _.isEmpty(tags)
    ? undefined
    : tags.map(tag => _.pick(tag, ["id", "label"]));
}

export const mapTalents = mappr({
  talents: params =>
    _.isEmpty(params.talents)
      ? undefined
      : params.talents.map(talent => {
          return {
            id: talent.id,
            roles: _.isEmpty(talent.roles) ? undefined : talent.roles,
            characters: _.isEmpty(talent.characters)
              ? undefined
              : talent.characters
          };
        })
});

export const mapReviews = mappr({
  reviews: params =>
    _.isEmpty(params.reviews)
      ? undefined
      : params.reviews.map(review => _.pick(review, ["source", "rating"]))
});
