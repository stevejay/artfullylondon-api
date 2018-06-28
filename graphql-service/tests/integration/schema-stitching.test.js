import request from "request-promise-native";
import MockService from "../utils/mock-service";
jest.setTimeout(60000);

describe("schema stitching", () => {
  const mockTagService = new MockService();

  beforeEach(() => {
    mockTagService.start(3011);
  });

  afterEach(() => {
    mockTagService.stop();
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

    const result = await request({
      uri: "http://localhost:3017/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: "Bearer aaaaaaaaaaaaaaaa" },
      body: { query: "{ tags { audience { label } geo { label } } }" },
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
