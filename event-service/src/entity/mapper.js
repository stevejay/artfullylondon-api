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
    (params.links || []).map(link => ({
      type: link.type,
      url: link.url
    }))
});

export const mapRequestImages = mappr({
  images: params =>
    (params.images || []).map(image =>
      _.pick(image, ["id", "ratio", "copyright", "dominantColor"])
    )
});

export const mapEntityEditDates = params => {
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
        _.pick(closure, ["date", "from", "to"])
      );
}

export function mapNamedClosures(params) {
  return _.isEmpty(params.namedClosures) ? undefined : params.namedClosures;
}
