import request from "request-promise-native";
import MockService from "../utils/mock-service";
jest.setTimeout(60000);

describe("schema stitching", () => {
  const mockTagService = new MockService();
  const mockDataService = new MockService();

  beforeEach(() => {
    mockTagService.start(3011);
    mockDataService.start(3010);
  });

  afterEach(() => {
    mockTagService.stop();
    mockDataService.stop();
  });

  it("should have stitched in the tag service", async () => {
    mockTagService.setResponseBody({
      data: {
        tags: {
          geo: [
            {
              label: "germany"
            }
          ],
          audience: []
        }
      }
    });

    mockDataService.setResponseBody({
      data: {
        heroImage: {
          name: "shoreditch-graffiti",
          dominantColor: "#2e2d27",
          label: "Graffiti in Shoreditch"
        }
      }
    });

    const query = `
    {
      tags {
        audience { label }
        geo { label }
      }
      heroImage {
        name
        dominantColor
        label
      }
    }
    `;

    const result = await request({
      uri: "http://localhost:3015/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: "Bearer aaaaaaaaaaaaaaaa" },
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
      data: {
        tags: {
          geo: [
            {
              label: "germany"
            }
          ],
          audience: []
        },
        heroImage: {
          name: "shoreditch-graffiti",
          dominantColor: "#2e2d27",
          label: "Graffiti in Shoreditch"
        }
      }
    });

    expect(mockTagService.lastHeaders).toEqual(
      expect.objectContaining({
        authorization: "Bearer aaaaaaaaaaaaaaaa"
      })
    );
  });
});
