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

export function mapRequestOpeningTimes(params) {
  return _.isEmpty(params.openingTimes)
    ? undefined
    : params.openingTimes.map(openingTime =>
        _.pick(openingTime, ["day", "from", "to", "timesRangeId"])
      );
}

export function mapRequestAdditionalOpeningTimes(params) {
  return _.isEmpty(params.additionalOpeningTimes)
    ? undefined
    : params.additionalOpeningTimes.map(additional =>
        _.pick(additional, ["date", "from", "to"])
      );
}

export function mapRequestOpeningTimesClosures(params) {
  return _.isEmpty(params.openingTimesClosures)
    ? undefined
    : params.openingTimesClosures.map(openingTime =>
        _.pick(openingTime, ["date", "from", "to"])
      );
}
