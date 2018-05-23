'use strict';

exports.CURRENT_VENUE_SCHEME_VERSION = 4;

exports.VENUE_TYPE_THEATRE = 'Theatre';
exports.VENUE_TYPE_ART_GALLERY = 'Art Gallery';
exports.VENUE_TYPE_CONCERT_HALL = 'Concert Hall';
exports.VENUE_TYPE_EXHIBITION_HALL = 'Exhibition Hall';
exports.VENUE_TYPE_PERFORMING_ARTS_CENTRE = 'Performing Arts Centre';
exports.VENUE_TYPE_MUSEUM = 'Museum';
exports.VENUE_TYPE_CHURCH = 'Church';
exports.VENUE_TYPE_CINEMA = 'Cinema';
exports.VENUE_TYPE_OTHER = 'Other';

exports.ALLOWED_VENUE_TYPES = [
  exports.VENUE_TYPE_THEATRE,
  exports.VENUE_TYPE_ART_GALLERY,
  exports.VENUE_TYPE_CONCERT_HALL,
  exports.VENUE_TYPE_EXHIBITION_HALL,
  exports.VENUE_TYPE_PERFORMING_ARTS_CENTRE,
  exports.VENUE_TYPE_MUSEUM,
  exports.VENUE_TYPE_CHURCH,
  exports.VENUE_TYPE_CINEMA,
  exports.VENUE_TYPE_OTHER
];

exports.LOCATION_AREA_TYPE_CENTRAL = 'Central';
exports.LOCATION_AREA_TYPE_WEST = 'West';
exports.LOCATION_AREA_TYPE_NORTH = 'North';
exports.LOCATION_AREA_TYPE_EAST = 'East';
exports.LOCATION_AREA_TYPE_SOUTH_EAST = 'SouthEast';
exports.LOCATION_AREA_TYPE_SOUTH_WEST = 'SouthWest';

exports.SUMMARY_VENUE_PROJECTION_EXPRESSION = 'id, #s, #n, venueType, address, postcode, latitude, longitude, ' +
  'images';

exports.SUMMARY_VENUE_PROJECTION_NAMES = {
  '#s': 'status',
  '#n': 'name'
};
