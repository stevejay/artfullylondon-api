import { GraphQLDate } from "graphql-iso-date";

export default {
  IsoShortDate: GraphQLDate,
  Query: {
    heroImage: () => ({
      name: "shoreditch-graffiti",
      dominantColor: "#2e2d27",
      label: "Graffiti in Shoreditch"
    }),
    namedClosures: () => ({
      BankHolidays: [
        "2018-01-01",
        "2018-03-30",
        "2018-04-02",
        "2018-05-07",
        "2018-05-28",
        "2018-08-27",
        "2018-12-25",
        "2018-12-26",
        "2019-01-01",
        "2019-04-19",
        "2019-04-22",
        "2019-05-06",
        "2019-05-27",
        "2019-08-26",
        "2019-12-25",
        "2019-12-26"
      ],
      EasterSunday: ["2018-04-01", "2019-04-21"],
      RoshHashanah: [
        "2018-09-09",
        "2018-09-10",
        "2018-09-11",
        "2019-09-29",
        "2019-09-30",
        "2019-10-01"
      ],
      YomKippur: ["2018-09-19", "2019-10-08", "2019-10-09"]
    })
  }
};
