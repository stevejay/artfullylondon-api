import request from "request-promise-native";
jest.setTimeout(60000);

describe("graphql handler", () => {
  it("should return data", async () => {
    const query = `
    {
      heroImage {
        name
        dominantColor
        label
      }
      namedClosures {
        BankHolidays
        EasterSunday
        RoshHashanah
        YomKippur
      }
    }`;

    const result = await request({
      uri: "http://localhost:3010/graphql",
      json: true,
      method: "POST",
      body: { query },
      timeout: 30000,
      resolveWithFullResponse: true
    });

    expect(result.headers).toEqual(
      expect.objectContaining({
        "access-control-allow-credentials": "true",
        "access-control-allow-origin": "*"
      })
    );

    expect(result.body).toEqual({
      data: expect.objectContaining({
        heroImage: expect.objectContaining({
          name: "shoreditch-graffiti",
          dominantColor: "#2e2d27",
          label: "Graffiti in Shoreditch"
        })
      })
    });
  });
});
