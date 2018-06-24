import request from "request-promise-native";
import http from "http";
import path from "path";
import mockserver from "mockserver";
jest.setTimeout(60000);

const MOCK_SEARCH_SERVICE_DIR = path.resolve(
  __dirname,
  "../mocks/mock-search-service"
);

describe("sitemap handler", () => {
  let mockSearchServer = null;

  beforeAll(async () => {
    await new Promise((resolve, reject) => {
      mockSearchServer = http.createServer(mockserver(MOCK_SEARCH_SERVICE_DIR));
      mockSearchServer.listen(
        { port: 3013, exclusive: true },
        err => (err ? reject(err) : resolve())
      );
    });
  });

  afterAll(async () => {
    if (mockSearchServer) {
      await new Promise((resolve, reject) => {
        mockSearchServer.close(err => (err ? reject(err) : resolve()));
      });
    }
  });

  it("should return a sitemap", async () => {
    const result = await request("http://localhost:3010/public/sitemap.txt");
    expect(result).toEqual(
      "https://www.artfully.london/event/almeida/2018/some-event\n" +
        "https://www.artfully.london/event/arcola/2017/some-event"
    );
  });
});
