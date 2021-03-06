import _ from "lodash";
import mappr from "mappr";
import * as areaType from "../../types/area-type";

const AREA_DATA = [
  {
    regex: /^(?:SW7|SW3|SW1[A-Z]|W1|W1[A-Z]|W2|W9|NW8|NW1|N1C|N1|WC.+|EC.+|SE1|SE11|E1W|E2|E1)$/,
    type: areaType.CENTRAL
  },
  {
    regex: /^(?:W\d+|UB.+|SL.+)$/,
    type: areaType.WEST
  },
  {
    regex: /^(?:N\d+|EN.+|AL.+)$/,
    type: areaType.NORTH
  },
  {
    regex: /^(?:NW\d+|HA.+|WD.+|HP.+)$/,
    type: areaType.NORTH
  },
  {
    regex: /^(?:E\d+|IG.+|RM.+|CM.+)$/,
    type: areaType.EAST
  },
  {
    regex: /^(?:SE\d+|CR.+|BR.+|DA.+|TN.+)$/,
    type: areaType.SOUTH_EAST
  },
  {
    regex: /^(?:SW\d+|TW.+|KT.+|SM.+)$/,
    type: areaType.SOUTH_WEST
  }
];

export const mapLocation = mappr({
  lat: "latitude",
  lon: "longitude"
});

export function mapLondonArea(event) {
  const postcodeDistrict = getPostcodeDistrict(event.venue.postcode);
  const match = _.find(AREA_DATA, area => area.regex.test(postcodeDistrict));
  if (match) {
    return match.type;
  } else {
    throw new Error(`postcode district not matched: ${postcodeDistrict}`);
  }
}

const POSTCODE_DISTRICT_REGEX = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?/;

function getPostcodeDistrict(postcode) {
  var matches = (postcode || "").match(POSTCODE_DISTRICT_REGEX);
  return matches ? matches[0] : undefined;
}
