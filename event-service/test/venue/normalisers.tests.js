'use strict';

const expect = require('chai').expect;
const normalise = require('normalise-request');
const normalisers = require('../../lib/venue/normalisers');
const addressNormaliser = require('../../lib/venue/address-normaliser');
normalise.normalisers.address = addressNormaliser;

describe('venue normalisers', () => {
  it('should apply normalisers to a fully populated request', () => {
    const params = {
      name: 'Almeida Theatre   ',
      status: 'Active',
      venueType: 'Theatre',
      description: '   description   ',
      descriptionCredit: ' Some credit   ',
      address: 'Almeida St\n   Islington  ,  \r\nLondon',
      postcode: 'n1   1ta',
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: 'FullAccess',
      disabledBathroomType: 'Present',
      hearingFacilitiesType: 'HearingLoops',
      email: '  boxoffice@almeida.co.uk',
      telephone: ' (  020 ) 7359-4404',
      openingTimes: [{ day: 0, from: '09:00', to: '18:00' }],
      additionalOpeningTimes: [
        { date: '2016/02/12', from: '23:00', to: '23:30' }
      ],
      openingTimesClosures: [{ date: '2016/01/15' }],
      namedClosures: ['ChristmasDay', 'NewYearsDay'],
      links: [{ type: 'Wikipedia', url: '  http://wikipedia.com/foo   ' }],
      images: [
        {
          id: 'abcd1234abcd1234abcd1234abcd1234',
          ratio: 1.2,
          copyright: '  Foo  '
        }
      ],
      weSay: '   something  ',
      notes: '   a note   '
    };

    normalise(params, normalisers);

    expect(params).to.eql({
      name: 'Almeida Theatre',
      status: 'Active',
      venueType: 'Theatre',
      description: 'description',
      descriptionCredit: 'Some credit',
      address: 'Almeida St\nIslington\nLondon',
      postcode: 'N1 1TA',
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: 'FullAccess',
      disabledBathroomType: 'Present',
      hearingFacilitiesType: 'HearingLoops',
      email: 'boxoffice@almeida.co.uk',
      telephone: '020 7359 4404',
      openingTimes: [{ day: 0, from: '09:00', to: '18:00' }],
      additionalOpeningTimes: [
        { date: '2016/02/12', from: '23:00', to: '23:30' }
      ],
      openingTimesClosures: [{ date: '2016/01/15' }],
      namedClosures: ['ChristmasDay', 'NewYearsDay'],
      links: [{ type: 'Wikipedia', url: 'http://wikipedia.com/foo' }],
      images: [
        {
          id: 'abcd1234abcd1234abcd1234abcd1234',
          ratio: 1.2,
          copyright: 'Foo',
          dominantColor: undefined
        }
      ],
      weSay: 'something',
      notes: 'a note'
    });
  });

  it('should apply normalisers to a minimally populated request', () => {
    const params = {
      name: 'Almeida Theatre   ',
      status: 'Active',
      venueType: 'Theatre',
      address: 'Almeida St\n   Islington  ,  \r\nLondon',
      postcode: 'n1   1ta',
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: 'FullAccess',
      disabledBathroomType: 'Present',
      hearingFacilitiesType: 'HearingLoops'
    };

    normalise(params, normalisers);

    expect(params).to.eql({
      name: 'Almeida Theatre',
      status: 'Active',
      venueType: 'Theatre',
      address: 'Almeida St\nIslington\nLondon',
      postcode: 'N1 1TA',
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: 'FullAccess',
      disabledBathroomType: 'Present',
      hearingFacilitiesType: 'HearingLoops',
      description: undefined,
      descriptionCredit: undefined,
      email: undefined,
      telephone: undefined,
      openingTimes: undefined,
      additionalOpeningTimes: undefined,
      openingTimesClosures: undefined,
      namedClosures: undefined,
      links: undefined,
      images: undefined,
      weSay: undefined,
      notes: undefined
    });
  });
});
