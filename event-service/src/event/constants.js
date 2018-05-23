'use strict';

exports.CURRENT_EVENT_SCHEME_VERSION = 4;

exports.ARTS_TYPE_VISUAL = 'Visual';
exports.ARTS_TYPE_PERFORMING = 'Performing';
exports.ARTS_TYPE_CREATIVE_WRITING = 'CreativeWriting';

exports.EVENT_TYPE_PERFORMANCE = 'Performance';
exports.EVENT_TYPE_EXHIBITION = 'Exhibition';
exports.EVENT_TYPE_COURSE = 'Course';

exports.ALLOWED_EVENT_TYPES = [
  exports.EVENT_TYPE_PERFORMANCE,
  exports.EVENT_TYPE_EXHIBITION,
  exports.EVENT_TYPE_COURSE,
];

exports.OCCURRENCE_TYPE_BOUNDED = 'Bounded';
exports.OCCURRENCE_TYPE_CONTINUOUS = 'Continuous';
exports.OCCURRENCE_TYPE_ONETIME = 'OneTime';

exports.ALLOWED_PERFORMANCE_OCCURRENCE_TYPES = [
  exports.OCCURRENCE_TYPE_BOUNDED,
  exports.OCCURRENCE_TYPE_CONTINUOUS,
  exports.OCCURRENCE_TYPE_ONETIME,
];

exports.ALLOWED_COURSE_OCCURRENCE_TYPES = [exports.OCCURRENCE_TYPE_BOUNDED];

exports.ALLOWED_EXHIBITION_OCCURRENCE_TYPES = [
  exports.OCCURRENCE_TYPE_BOUNDED,
  exports.OCCURRENCE_TYPE_CONTINUOUS,
];

exports.COST_TYPE_FREE = 'Free';
exports.COST_TYPE_PAID = 'Paid';
exports.COST_TYPE_UNKNOWN = 'Unknown';

exports.ALLOWED_COST_TYPES = [
  exports.COST_TYPE_FREE,
  exports.COST_TYPE_PAID,
  exports.COST_TYPE_UNKNOWN,
];

exports.BOOKING_TYPE_NOT_REQUIRED = 'NotRequired';
exports.BOOKING_TYPE_REQUIRED = 'Required';
exports.BOOKING_TYPE_REQUIRED_FOR_NON_MEMBERS = 'RequiredForNonMembers';

exports.ALLOWED_BOOKING_TYPES = [
  exports.BOOKING_TYPE_NOT_REQUIRED,
  exports.BOOKING_TYPE_REQUIRED,
  exports.BOOKING_TYPE_REQUIRED_FOR_NON_MEMBERS,
];

// The fields of industrial design, graphic design, fashion design,
// interior design, and the decorative arts are considered applied arts.
// In a creative or abstract context, the fields of architecture and
// photography are also considered applied arts.

exports.VISUAL_ARTS_MEDIUMS = [
  'medium/applied-arts',
  'medium/architecture',
  'medium/ceramics',
  'medium/computer-art',
  'medium/conceptual-art',
  'medium/drawing',
  'medium/graphic-design',
  'medium/installation',
  'medium/painting',
  'medium/photography',
  'medium/printmaking',
  'medium/sculpture',
  'medium/textiles',
  'medium/video-art',
  'medium/fashion',
  'medium/design',
  'medium/mixed-media',
  'medium/multimedia',
];

exports.PERFORMING_ARTS_MEDIUMS = [
  'medium/circus-arts',
  'medium/dance',
  'medium/mime',
  'medium/musical-theatre',
  'medium/opera',
  'medium/performance-art',
  'medium/puppetry',
  'medium/theatre',
];

exports.CREATIVE_WRITING_MEDIUMS = ['medium/literature', 'medium/poetry'];
